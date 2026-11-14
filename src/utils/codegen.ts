import { I18nError } from './errors';

export type PrimitiveName =
  'string' | 'number' | 'boolean' | 'null' | 'unknown';

export interface TypeField {
  name: string;
  type: TypeNode;
  optional: boolean;
}

export type TypeNode =
  | { kind: 'primitive'; name: PrimitiveName; integer?: boolean }
  | { kind: 'array'; element: TypeNode }
  | { kind: 'object'; fields: TypeField[] }
  | { kind: 'union'; options: TypeNode[] };

function primitive(name: PrimitiveName, integer?: boolean): TypeNode {
  return { kind: 'primitive', name, integer };
}

function isNull(node: TypeNode): boolean {
  return node.kind === 'primitive' && node.name === 'null';
}

function isUnknown(node: TypeNode): boolean {
  return node.kind === 'primitive' && node.name === 'unknown';
}

export function inferType(value: unknown): TypeNode {
  if (value === null) {
    return primitive('null');
  }

  switch (typeof value) {
    case 'string':
      return primitive('string');
    case 'boolean':
      return primitive('boolean');
    case 'number':
      return primitive('number', Number.isInteger(value));
    case 'object': {
      if (Array.isArray(value)) {
        if (value.length === 0) {
          return { kind: 'array', element: primitive('unknown') };
        }
        return {
          kind: 'array',
          element: value.map(inferType).reduce(mergeTypes),
        };
      }

      return {
        kind: 'object',
        fields: Object.entries(value as Record<string, unknown>).map(
          ([name, fieldValue]) => ({
            name,
            type: inferType(fieldValue),
            optional: false,
          })
        ),
      };
    }
    default:
      return primitive('unknown');
  }
}

function mergeObjects(
  first: Extract<TypeNode, { kind: 'object' }>,
  second: Extract<TypeNode, { kind: 'object' }>
): TypeNode {
  const secondByName = new Map(second.fields.map(field => [field.name, field]));
  const firstNames = new Set(first.fields.map(field => field.name));
  const fields: TypeField[] = [];

  for (const field of first.fields) {
    const other = secondByName.get(field.name);
    fields.push(
      other
        ? {
            ...field,
            type: mergeTypes(field.type, other.type),
            optional: field.optional || other.optional,
          }
        : { ...field, optional: true }
    );
  }

  for (const field of second.fields) {
    if (!firstNames.has(field.name)) {
      fields.push({ ...field, optional: true });
    }
  }

  return { kind: 'object', fields };
}

function typeSignature(node: TypeNode): string {
  switch (node.kind) {
    case 'primitive':
      return `p:${node.name}:${node.integer ? 1 : 0}`;
    case 'array':
      return `a:${typeSignature(node.element)}`;
    case 'object':
      return `o:{${node.fields
        .map(
          field =>
            `${field.name}${field.optional ? '?' : ''}:${typeSignature(
              field.type
            )}`
        )
        .join(',')}}`;
    case 'union':
      return `u:${node.options.map(typeSignature).join('|')}`;
  }
}

function makeUnion(options: TypeNode[]): TypeNode {
  const flat = options.flatMap(option =>
    option.kind === 'union' ? option.options : [option]
  );

  if (flat.some(isUnknown)) {
    return primitive('unknown');
  }

  const unique: TypeNode[] = [];
  const seen = new Set<string>();

  for (const option of flat) {
    const signature = typeSignature(option);
    if (!seen.has(signature)) {
      seen.add(signature);
      unique.push(option);
    }
  }

  if (unique.length === 1) {
    return unique[0];
  }

  // Keep `null` last so generated code reads naturally: `string | null`.
  return {
    kind: 'union',
    options: [
      ...unique.filter(option => !isNull(option)),
      ...unique.filter(isNull),
    ],
  };
}

export function mergeTypes(first: TypeNode, second: TypeNode): TypeNode {
  if (
    first.kind === 'primitive' &&
    second.kind === 'primitive' &&
    first.name === second.name
  ) {
    if (first.name === 'number') {
      return primitive('number', Boolean(first.integer && second.integer));
    }
    return first;
  }

  if (first.kind === 'object' && second.kind === 'object') {
    return mergeObjects(first, second);
  }

  if (first.kind === 'array' && second.kind === 'array') {
    return {
      kind: 'array',
      element: mergeTypes(first.element, second.element),
    };
  }

  return makeUnion([first, second]);
}

export function toPascalCase(input: string): string {
  const words = input
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean);

  let name = words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

  if (!name) {
    name = 'Type';
  }
  if (/^\d/.test(name)) {
    name = `Type${name}`;
  }
  return name;
}

export function toCamelCase(input: string): string {
  const pascal = toPascalCase(input);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

interface NameContext {
  names: WeakMap<TypeNode, string>;
  used: Set<string>;
  queue: Array<{
    node: Extract<TypeNode, { kind: 'object' }>;
    name: string;
  }>;
}

function createContext(): NameContext {
  return { names: new WeakMap(), used: new Set(), queue: [] };
}

function reserveName(context: NameContext, base: string): string {
  let name = base;
  let suffix = 2;
  while (context.used.has(name)) {
    name = `${base}${suffix}`;
    suffix += 1;
  }
  context.used.add(name);
  return name;
}

function objectName(
  node: Extract<TypeNode, { kind: 'object' }>,
  suggested: string,
  context: NameContext
): string {
  const existing = context.names.get(node);
  if (existing) {
    return existing;
  }

  const name = reserveName(context, toPascalCase(suggested));
  context.names.set(node, name);
  context.queue.push({ node, name });
  return name;
}

function drainQueue(
  context: NameContext,
  render: (node: Extract<TypeNode, { kind: 'object' }>, name: string) => void
): void {
  while (context.queue.length > 0) {
    const item = context.queue.shift()!;
    render(item.node, item.name);
  }
}

const TS_IDENTIFIER = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

function tsPropertyName(name: string): string {
  return TS_IDENTIFIER.test(name) ? name : JSON.stringify(name);
}

function tsType(
  node: TypeNode,
  suggested: string,
  context: NameContext
): string {
  switch (node.kind) {
    case 'primitive':
      switch (node.name) {
        case 'string':
          return 'string';
        case 'number':
          return 'number';
        case 'boolean':
          return 'boolean';
        case 'null':
          return 'null';
        default:
          return 'unknown';
      }
    case 'array': {
      const element = tsType(node.element, `${suggested}Item`, context);
      return node.element.kind === 'union' ? `(${element})[]` : `${element}[]`;
    }
    case 'object':
      return objectName(node, suggested, context);
    case 'union':
      return node.options
        .map(option => tsType(option, suggested, context))
        .join(' | ');
  }
}

function renderTsInterface(
  node: Extract<TypeNode, { kind: 'object' }>,
  name: string,
  context: NameContext
): string {
  const fields = node.fields.map(field => {
    const fieldName = `${name}${toPascalCase(field.name)}`;
    const optional = field.optional ? '?' : '';
    return `  ${tsPropertyName(field.name)}${optional}: ${tsType(
      field.type,
      fieldName,
      context
    )};`;
  });

  return `export interface ${name} {\n${fields.join('\n')}\n}`;
}

export function generateTypeScript(value: unknown, rootName = 'Root'): string {
  const context = createContext();
  const root = inferType(value);
  const name = toPascalCase(rootName);
  const output: string[] = [];

  if (root.kind === 'object') {
    context.used.add(name);
    context.names.set(root, name);
    output.push(renderTsInterface(root, name, context));
  } else {
    output.push(`export type ${name} = ${tsType(root, name, context)};`);
  }

  drainQueue(context, (node, nodeName) => {
    output.push(renderTsInterface(node, nodeName, context));
  });

  return output.join('\n\n');
}

function goPrimitive(node: Extract<TypeNode, { kind: 'primitive' }>): string {
  switch (node.name) {
    case 'string':
      return 'string';
    case 'number':
      return node.integer ? 'int64' : 'float64';
    case 'boolean':
      return 'bool';
    case 'null':
    case 'unknown':
      return 'interface{}';
  }
}

function goType(
  node: TypeNode,
  suggested: string,
  context: NameContext
): string {
  switch (node.kind) {
    case 'primitive':
      return goPrimitive(node);
    case 'array':
      return `[]${goType(node.element, `${suggested}Item`, context)}`;
    case 'object':
      return objectName(node, suggested, context);
    case 'union':
      return 'interface{}';
  }
}

function renderGoStruct(
  node: Extract<TypeNode, { kind: 'object' }>,
  name: string,
  context: NameContext
): string {
  const used = new Set<string>();
  const fields = node.fields.map(field => {
    let fieldName = toPascalCase(field.name);
    let suffix = 2;
    while (used.has(fieldName)) {
      fieldName = `${toPascalCase(field.name)}${suffix}`;
      suffix += 1;
    }
    used.add(fieldName);

    const tag = `json:"${field.name}${field.optional ? ',omitempty' : ''}"`;
    return `\t${fieldName} ${goType(
      field.type,
      `${name}${toPascalCase(field.name)}`,
      context
    )} \`${tag}\``;
  });

  return `type ${name} struct {\n${fields.join('\n')}\n}`;
}

export function generateGo(value: unknown, rootName = 'Root'): string {
  const context = createContext();
  const root = inferType(value);
  const name = toPascalCase(rootName);
  const output: string[] = [];

  if (root.kind === 'object') {
    context.used.add(name);
    context.names.set(root, name);
    output.push(renderGoStruct(root, name, context));
  } else {
    output.push(`type ${name} ${goType(root, name, context)}`);
  }

  drainQueue(context, (node, nodeName) => {
    output.push(renderGoStruct(node, nodeName, context));
  });

  return output.join('\n\n');
}

const JAVA_KEYWORDS = new Set([
  'abstract',
  'assert',
  'boolean',
  'break',
  'byte',
  'case',
  'catch',
  'char',
  'class',
  'const',
  'continue',
  'default',
  'do',
  'double',
  'else',
  'enum',
  'extends',
  'final',
  'finally',
  'float',
  'for',
  'goto',
  'if',
  'implements',
  'import',
  'instanceof',
  'int',
  'interface',
  'long',
  'native',
  'new',
  'package',
  'private',
  'protected',
  'public',
  'return',
  'short',
  'static',
  'strictfp',
  'super',
  'switch',
  'synchronized',
  'this',
  'throw',
  'throws',
  'transient',
  'try',
  'void',
  'volatile',
  'while',
]);

function javaFieldName(name: string): string {
  const camel = toCamelCase(name);
  return JAVA_KEYWORDS.has(camel) ? `${camel}_` : camel;
}

function javaType(
  node: TypeNode,
  suggested: string,
  context: NameContext
): string {
  switch (node.kind) {
    case 'primitive':
      switch (node.name) {
        case 'string':
          return 'String';
        case 'number':
          return node.integer ? 'Long' : 'Double';
        case 'boolean':
          return 'Boolean';
        default:
          return 'Object';
      }
    case 'array':
      return `List<${javaType(node.element, `${suggested}Item`, context)}>`;
    case 'object':
      return objectName(node, suggested, context);
    case 'union':
      return 'Object';
  }
}

function renderJavaClass(
  node: Extract<TypeNode, { kind: 'object' }>,
  name: string,
  context: NameContext,
  isRoot: boolean
): string {
  const used = new Set<string>();
  const fields = node.fields.map(field => {
    let fieldName = javaFieldName(field.name);
    let suffix = 2;
    while (used.has(fieldName)) {
      fieldName = `${javaFieldName(field.name)}${suffix}`;
      suffix += 1;
    }
    used.add(fieldName);

    return `    public ${javaType(
      field.type,
      `${name}${toPascalCase(field.name)}`,
      context
    )} ${fieldName};`;
  });

  const modifier = isRoot ? 'public class' : 'class';
  return `${modifier} ${name} {\n${fields.join('\n')}\n}`;
}

export function generateJava(value: unknown, rootName = 'Root'): string {
  const root = inferType(value);

  if (root.kind !== 'object') {
    throw new I18nError('converter.errors.javaRoot');
  }

  const context = createContext();
  const name = toPascalCase(rootName);
  context.used.add(name);
  context.names.set(root, name);

  const classes = [renderJavaClass(root, name, context, true)];
  drainQueue(context, (node, nodeName) => {
    classes.push(renderJavaClass(node, nodeName, context, false));
  });

  const body = classes.join('\n\n');
  const importLine = body.includes('List<') ? 'import java.util.List;\n\n' : '';

  return `${importLine}${body}`;
}
