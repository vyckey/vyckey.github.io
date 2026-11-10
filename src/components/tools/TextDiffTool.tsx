import React, { useId, useMemo, useState } from 'react';
import TextDiffView from './TextDiffView';
import { Button, Flex, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import CopyableTextArea from '../CopyableTextArea';

export default function TextDiffTool() {
  const { t } = useTranslation();
  const [editMode, setEditMode] = useState(true);
  const [prevText, setPrevText] = useState<string>('');
  const [newText, setNewText] = useState<string>('');
  const [outputFormat, setOutputFormat] = useState<
    'side-by-side' | 'line-by-line'
  >('side-by-side');
  const diffId = useId().replace(/:/g, '');
  const fileDiffList = useMemo(
    () => [
      {
        fileName: 'Text Diff',
        prevData: prevText,
        newData: newText,
      },
    ],
    [prevText, newText]
  );

  return (
    <Flex vertical gap="small">
      <Flex gap="middle" justify="center">
        <Button type="primary" onClick={() => setEditMode(!editMode)}>
          {editMode ? t('textdiff.diff') : t('textdiff.backToEdit')}
        </Button>
        {(editMode && (
          <Button
            onClick={() => {
              setPrevText('');
              setNewText('');
            }}>
            {t('textdiff.clear')}
          </Button>
        )) || (
          <Select
            value={outputFormat}
            onChange={value => setOutputFormat(value)}
            options={[
              {
                label: t('textdiff.sideBySide'),
                value: 'side-by-side',
              },
              {
                label: t('textdiff.lineByLine'),
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
            placeholder={t('textdiff.originalPlaceholder')}
            onChange={e => setPrevText(e.target.value)}
          />
        </div>
        <div style={{ width: '50%' }}>
          <CopyableTextArea
            showCount
            rows={29}
            value={newText}
            placeholder={t('textdiff.currentPlaceholder')}
            onChange={e => setNewText(e.target.value)}
          />
        </div>
      </Flex>
      {!editMode && (
        <TextDiffView
          id={`diff-ui-${diffId}`}
          useUI={true}
          fileListToggle={false}
          fileDiffList={fileDiffList}
          outputFormat={outputFormat}
        />
      )}
    </Flex>
  );
}
