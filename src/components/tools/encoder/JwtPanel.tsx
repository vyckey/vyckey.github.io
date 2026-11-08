import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Flex, Input, Tag, Typography, message } from 'antd';
import CopyButton from '../../CopyButton';
import CopyableTextArea from '../../CopyableTextArea';
import {
  decodeJwt,
  getJwtTimeClaims,
  verifyJwtHs256,
} from '../../../utils/jwt';
import { MONO_FONT } from './TransformPanel';

const { Text } = Typography;

type VerifyState = 'idle' | 'valid' | 'invalid';

const statusColors: Record<string, string> = {
  expired: 'red',
  active: 'green',
  notYetValid: 'orange',
  info: 'default',
};

const JwtPanel: React.FC = () => {
  const [token, setToken] = useState('');
  const [secret, setSecret] = useState('');
  const [verifyState, setVerifyState] = useState<VerifyState>('idle');

  const { decoded, error } = useMemo(() => {
    if (!token.trim()) {
      return { decoded: null, error: '' };
    }

    try {
      return { decoded: decodeJwt(token), error: '' };
    } catch (e) {
      return {
        decoded: null,
        error: e instanceof Error ? e.message : String(e),
      };
    }
  }, [token]);

  useEffect(() => {
    setVerifyState('idle');
  }, [token, secret]);

  const timeClaims = decoded ? getJwtTimeClaims(decoded.payload) : [];

  function handleVerify() {
    try {
      setVerifyState(verifyJwtHs256(token, secret) ? 'valid' : 'invalid');
    } catch (e) {
      message.error(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <Flex vertical gap={12} style={{ maxWidth: 960 }}>
      <Text strong>JWT</Text>
      <CopyableTextArea
        value={token}
        onChange={e => setToken(e.target.value)}
        allowClear
        rows={4}
        showCount
        placeholder="粘贴 JWT，可带 Bearer 前缀，例如 eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        style={{ fontFamily: MONO_FONT }}
      />

      {error ? <Alert type="error" showIcon title={error} /> : null}

      {!token.trim() ? (
        <Text type="secondary" style={{ fontSize: 12 }}>
          JWT 由 Header、Payload、Signature 三段 Base64URL
          组成，解析和校验都在浏览器本地完成。
        </Text>
      ) : null}

      {decoded ? (
        <>
          <Flex wrap gap={8} align="center">
            <Tag color="blue">alg: {String(decoded.header.alg ?? '未知')}</Tag>
            {decoded.header.typ ? (
              <Tag>typ: {String(decoded.header.typ)}</Tag>
            ) : null}
            {timeClaims.map(claim => (
              <Tag
                key={claim.claim}
                color={statusColors[claim.status]}
                title={`${claim.label}：${claim.date}`}>
                {claim.label}：{claim.date}
              </Tag>
            ))}
          </Flex>

          <Text strong>Header</Text>
          <CopyableTextArea
            value={decoded.headerText}
            readOnly
            rows={5}
            style={{ fontFamily: MONO_FONT }}
          />

          <Text strong>Payload</Text>
          <CopyableTextArea
            value={decoded.payloadText}
            readOnly
            rows={12}
            style={{ fontFamily: MONO_FONT }}
          />

          <Flex wrap gap={8} align="center">
            <Text strong>签名校验</Text>
            <Input.Password
              value={secret}
              onChange={e => setSecret(e.target.value)}
              placeholder="HS256 密钥（仅在本地计算）"
              style={{ width: 280 }}
            />
            <Button onClick={handleVerify} disabled={!secret || !token.trim()}>
              校验
            </Button>
            {verifyState === 'valid' ? (
              <Tag color="success">签名有效</Tag>
            ) : null}
            {verifyState === 'invalid' ? (
              <Tag color="error">签名不匹配</Tag>
            ) : null}
            {decoded.header.alg !== 'HS256' ? (
              <Text type="secondary" style={{ fontSize: 12 }}>
                当前仅支持校验 HS256 签名
              </Text>
            ) : null}
          </Flex>

          <Text strong>Signature</Text>
          <Flex gap={8} align="center">
            <Text code style={{ wordBreak: 'break-all', fontSize: 12 }}>
              {decoded.signature || '（空）'}
            </Text>
            <CopyButton value={decoded.signature} />
          </Flex>
        </>
      ) : null}
    </Flex>
  );
};

export default JwtPanel;
