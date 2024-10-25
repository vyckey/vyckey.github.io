import React, { useState } from 'react';
import TextDiffView from './TextDiffView';
import { Button, Flex, Select } from 'antd';
import CopyableTextArea from '../CopyableTextArea';

export default function TextDiffTool() {
  const [editMode, setEditMode] = useState(true);
  const [prevText, setPrevText] = useState<string>('');
  const [newText, setNewText] = useState<string>('');
  const [outputFormat, setOutputFormat] = useState<
    'side-by-side' | 'line-by-line'
  >('side-by-side');

  return (
    <Flex vertical gap="small">
      <Flex gap="middle" justify="center">
        <Button type="primary" onClick={() => setEditMode(!editMode)}>
          {editMode ? 'Diff文本' : '返回编辑'}
        </Button>
        {(editMode && (
          <Button
            onClick={() => {
              setPrevText('');
              setNewText('');
            }}>
            清除
          </Button>
        )) || (
          <Select
            value={outputFormat}
            onChange={value => setOutputFormat(value)}
            options={[
              {
                label: '左右对比',
                value: 'side-by-side',
              },
              {
                label: '分行对比',
                value: 'line-by-line',
              },
            ]}
          />
        )}
      </Flex>
      <Flex gap="middle" style={{ display: editMode ? '' : 'none' }}>
        <div style={{ width: '50%' }}>
          <CopyableTextArea
            showCount
            rows={29}
            value={prevText}
            placeholder="请输入原始文本"
            onChange={e => setPrevText(e.target.value)}
          />
        </div>
        <div style={{ width: '50%' }}>
          <CopyableTextArea
            showCount
            rows={29}
            value={newText}
            placeholder="请输入当前文本"
            onChange={e => setNewText(e.target.value)}
          />
        </div>
      </Flex>
      {!editMode && (
        <TextDiffView
          id={'diff-ui-mult'}
          useUI={true}
          fileListToggle={false}
          fileDiffList={[
            {
              fileName: 'Text Diff',
              prevData: prevText,
              newData: newText,
            },
          ]}
          outputFormat={outputFormat}
        />
      )}
    </Flex>
  );
}
