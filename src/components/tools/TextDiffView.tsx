import React, { useEffect, useState } from 'react';
import { createPatch } from 'diff';
import { html, parse } from 'diff2html';
import { Diff2HtmlUI } from 'diff2html/lib/ui/js/diff2html-ui';
import 'highlight.js/styles/googlecode.css';
import 'diff2html/bundles/css/diff2html.min.css';
import { DiffFile } from 'diff2html/lib/types';

interface FileDiffProps {
  fileName?: string;
  oldHeader?: string;
  newHeader?: string;
  prevData: string;
  newData: string;
  isJson?: boolean;
}

interface TextDiffViewProps {
  id: string;
  useUI: boolean;
  fileDiffList: FileDiffProps[];
  outputFormat: 'line-by-line' | 'side-by-side';
  fileListToggle: boolean;
}

const TextDiffView: React.FC<TextDiffViewProps> = ({
  id,
  useUI,
  fileDiffList,
  outputFormat,
  fileListToggle,
}) => {
  const [diffData, setDiffData] = useState('');

  useEffect(() => {
    createDiffView(fileDiffList);
  }, [fileDiffList]);

  const createDiffView = (fileDiffList: FileDiffProps[]) => {
    const diffFiles: DiffFile[] = [];
    for (const diffItem of fileDiffList) {
      const { fileName, oldHeader, newHeader, prevData, newData, isJson } =
        diffItem;
      let oldString = prevData || '';
      let newString = newData || '';
      if (isJson) {
        oldString = JSON.stringify(prevData, null, 2);
        newString = JSON.stringify(newData, null, 2);
      }

      const args = [
        fileName || '',
        oldString,
        newString,
        oldHeader || '',
        newHeader || '',
        { context: 99999 },
      ];
      const diffStr = createPatch(...args);
      diffFiles.push(parse(diffStr)[0]);
    }

    if (useUI) {
      const targetElement = document.getElementById(id);
      const config = {
        drawFileList: true,
        matching: 'lines',
        highlight: true,
        outputFormat: outputFormat,
      };

      const diff2htmlUi = new Diff2HtmlUI(targetElement, diffFiles, config);
      diff2htmlUi.draw();
      diff2htmlUi.highlightCode();
      diff2htmlUi.fileListToggle(fileListToggle);
    } else {
      const config = {
        drawFileList: true,
        // matching: "lines",
        showFiles: true,
        outputFormat,
      };
      const diffHtml = html(diffFiles, config);
      setDiffData(diffHtml);
    }
  };

  return useUI ? (
    <div id={id || 'code-diff-ui'} />
  ) : (
    <div id="code-diff" dangerouslySetInnerHTML={{ __html: diffData }} />
  );
};

export default TextDiffView;
