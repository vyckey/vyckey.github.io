import { describe, expect, it } from 'vitest';
import {
  generateGo,
  generateJava,
  generateTypeScript,
  inferType,
  mergeTypes,
  toCamelCase,
  toPascalCase,
} from './codegen';
import { I18nError } from './errors';

const value = {
  id: 1,
  name: 'Ada',
  active: true,
  tags: ['a', 'b'],
  profile: { email: 'ada@example.com', age: 36 },
  items: [{ sku: 'x', price: 1.5 }, { sku: 'y' }],
};

describe('codegen', () => {
  it('converts identifiers to PascalCase and camelCase', () => {
    expect(toPascalCase('user_id')).toBe('UserId');
    expect(toPascalCase('user id')).toBe('UserId');
    expect(toPascalCase('2fa')).toBe('Type2fa');
    expect(toCamelCase('user_id')).toBe('userId');
  });

  it('merges array item shapes and marks missing fields optional', () => {
    const type = inferType([{ a: 1 }, { a: 2, b: 'x' }]);

    expect(type.kind).toBe('array');
    if (type.kind === 'array' && type.element.kind === 'object') {
      expect(type.element.fields).toEqual([
        {
          name: 'a',
          type: { kind: 'primitive', name: 'number', integer: true },
          optional: false,
        },
        {
          name: 'b',
          type: { kind: 'primitive', name: 'string' },
          optional: true,
        },
      ]);
    }
  });

  it('builds unions for mixed values', () => {
    expect(mergeTypes(inferType(1), inferType('a'))).toMatchObject({
      kind: 'union',
    });
    expect(generateTypeScript([1, 'a'], 'Value')).toContain(
      'export type Value = (number | string)[];'
    );
  });

  it('generates TypeScript interfaces', () => {
    const code = generateTypeScript(value, 'User');

    expect(code).toContain('export interface User {');
    expect(code).toContain('id: number;');
    expect(code).toContain('tags: string[];');
    expect(code).toContain('profile: UserProfile;');
    expect(code).toContain('price?: number;');
    expect(code).toContain('export interface UserItemsItem {');
  });

  it('generates Go structs with json tags', () => {
    const code = generateGo(value, 'User');

    expect(code).toContain('type User struct {');
    expect(code).toContain('Id int64 `json:"id"`');
    expect(code).toContain('Tags []string `json:"tags"`');
    expect(code).toContain('Price float64 `json:"price,omitempty"`');
    expect(code).toContain('type UserItemsItem struct {');
  });

  it('generates Java classes', () => {
    const code = generateJava(value, 'User');

    expect(code).toContain('import java.util.List;');
    expect(code).toContain('public class User {');
    expect(code).toContain('public Long id;');
    expect(code).toContain('public List<UserItemsItem> items;');
    expect(code).toContain('class UserItemsItem {');
  });

  it('requires an object root for Java', () => {
    expect(() => generateJava([1, 2], 'Root')).toThrow(I18nError);
  });

  it('quotes invalid TypeScript property names', () => {
    const code = generateTypeScript({ 'first-name': 'Ada' });
    expect(code).toContain('"first-name": string;');
  });
});
