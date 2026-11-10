import React, { useMemo, useState } from 'react';
import {
  ArrowRightOutlined,
  SearchOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import {
  Card,
  Col,
  Empty,
  Flex,
  Input,
  Row,
  Space,
  theme,
  Typography,
} from 'antd';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTools } from '../config/tools';

const { Title, Text, Paragraph } = Typography;

const ToolsIndex: React.FC = () => {
  const {
    token: {
      colorPrimary,
      colorPrimaryBg,
      colorTextTertiary,
      colorBorderSecondary,
    },
  } = theme.useToken();
  const { t } = useTranslation();
  const { tools, groupTools } = useTools();
  const [keyword, setKeyword] = useState('');

  const query = keyword.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!query) {
      return tools;
    }

    return tools.filter(tool =>
      [
        tool.label,
        tool.description,
        tool.categoryLabel,
        tool.key,
        ...tool.keywords,
      ]
        .join(' ')
        .toLowerCase()
        .includes(query)
    );
  }, [query, tools]);

  const groups = groupTools(filtered);

  return (
    <Flex vertical gap={28}>
      <div style={{ textAlign: 'center', paddingTop: 8 }}>
        <Title level={2} style={{ marginBottom: 8 }}>
          {t('toolsIndex.title')}
        </Title>
        <Paragraph type="secondary" style={{ marginBottom: 20 }}>
          {t('toolsIndex.subtitle')}
        </Paragraph>
        <Input
          size="large"
          allowClear
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          prefix={<SearchOutlined />}
          placeholder={t('toolsIndex.searchPlaceholder')}
          style={{ maxWidth: 480 }}
        />
        <div style={{ marginTop: 12 }}>
          <Space size={6}>
            <SafetyCertificateOutlined style={{ color: colorTextTertiary }} />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {t('toolsIndex.privacy')}
            </Text>
          </Space>
        </div>
      </div>

      {groups.length === 0 ? (
        <Empty
          style={{ padding: '48px 0' }}
          description={
            <Text type="secondary">
              {t('toolsIndex.noResults', { keyword: keyword.trim() })}
            </Text>
          }>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {t('toolsIndex.noResultsHint')}
          </Text>
        </Empty>
      ) : (
        groups.map(group => (
          <section key={group.category}>
            <Flex align="center" gap={8} style={{ marginBottom: 12 }}>
              <Text strong style={{ fontSize: 16 }}>
                {group.categoryLabel}
              </Text>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {t('toolsIndex.toolCount', { count: group.items.length })}
              </Text>
            </Flex>
            <Row gutter={[16, 16]}>
              {group.items.map(tool => (
                <Col key={tool.key} xs={24} sm={12} lg={8} xxl={6}>
                  <Card
                    hoverable
                    variant="outlined"
                    style={{
                      height: '100%',
                      borderColor: colorBorderSecondary,
                    }}
                    styles={{ body: { padding: 0 } }}>
                    <Link
                      to={tool.path}
                      style={{
                        display: 'block',
                        padding: 16,
                        color: 'inherit',
                      }}>
                      <Flex gap={12} align="flex-start">
                        <span
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            width: 36,
                            height: 36,
                            borderRadius: 8,
                            fontSize: 18,
                            color: colorPrimary,
                            background: colorPrimaryBg,
                          }}>
                          {tool.icon}
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <Flex align="center" justify="space-between" gap={8}>
                            <Text strong>{tool.label}</Text>
                            <ArrowRightOutlined
                              style={{ fontSize: 12, color: colorTextTertiary }}
                            />
                          </Flex>
                          <Text
                            type="secondary"
                            style={{
                              display: '-webkit-box',
                              marginTop: 4,
                              fontSize: 12,
                              overflow: 'hidden',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                            }}>
                            {tool.description}
                          </Text>
                        </div>
                      </Flex>
                    </Link>
                  </Card>
                </Col>
              ))}
            </Row>
          </section>
        ))
      )}
    </Flex>
  );
};

export default ToolsIndex;
