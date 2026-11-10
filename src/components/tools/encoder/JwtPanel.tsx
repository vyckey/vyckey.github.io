import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Flex, Input, Tag, Typography, message } from 'antd';
import { useTranslation } from 'react-i18next';
import CopyButton from '../../CopyButton';
import CopyableTextArea from '../../CopyableTextArea';
import { translateError } from '../../../i18n/translateError';
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

const claimLabelKeys = {
  exp: 'encoder.jwt.claims.exp',
  nbf: 'encoder.jwt.claims.nbf',
  iat: 'encoder.jwt.claims.iat',
} as const;

const JwtPanel: React.FC = () => {
  const { t } = useTranslation();
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
        error: translateError(t, e),
      };
    }
  }, [token, t]);

  useEffect(() => {
    setVerifyState('idle');
  }, [token, secret]);

  const timeClaims = decoded ? getJwtTimeClaims(decoded.payload) : [];

  function handleVerify() {
    try {
      setVerifyState(verifyJwtHs256(token, secret) ? 'valid' : 'invalid');
    } catch (e) {
      message.error(translateError(t, e));
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
        placeholder={t('encoder.jwt.tokenPlaceholder')}
        style={{ fontFamily: MONO_FONT }}
      />

      {error ? <Alert type="error" showIcon title={error} /> : null}

      {!token.trim() ? (
        <Text type="secondary" style={{ fontSize: 12 }}>
          {t('encoder.jwt.hint')}
        </Text>
      ) : null}

      {decoded ? (
        <>
          <Flex wrap gap={8} align="center">
            <Tag color="blue">
              alg: {String(decoded.header.alg ?? t('encoder.jwt.unknownAlg'))}
            </Tag>
            {decoded.header.typ ? (
              <Tag>typ: {String(decoded.header.typ)}</Tag>
            ) : null}
            {timeClaims.map(claim => {
              const label = t(claimLabelKeys[claim.claim]);
              return (
                <Tag
                  key={claim.claim}
                  color={statusColors[claim.status]}
                  title={`${label}：${claim.date}`}>
                  {label}：{claim.date}
                </Tag>
              );
            })}
          </Flex>

          <Text strong>{t('encoder.jwt.header')}</Text>
          <CopyableTextArea
            value={decoded.headerText}
            readOnly
            rows={5}
            style={{ fontFamily: MONO_FONT }}
          />

          <Text strong>{t('encoder.jwt.payload')}</Text>
          <CopyableTextArea
            value={decoded.payloadText}
            readOnly
            rows={12}
            style={{ fontFamily: MONO_FONT }}
          />

          <Flex wrap gap={8} align="center">
            <Text strong>{t('encoder.jwt.verify')}</Text>
            <Input.Password
              value={secret}
              onChange={e => setSecret(e.target.value)}
              placeholder={t('encoder.jwt.secretPlaceholder')}
              style={{ width: 280 }}
            />
            <Button onClick={handleVerify} disabled={!secret || !token.trim()}>
              {t('encoder.jwt.verifyButton')}
            </Button>
            {verifyState === 'valid' ? (
              <Tag color="success">{t('encoder.jwt.valid')}</Tag>
            ) : null}
            {verifyState === 'invalid' ? (
              <Tag color="error">{t('encoder.jwt.invalid')}</Tag>
            ) : null}
            {decoded.header.alg !== 'HS256' ? (
              <Text type="secondary" style={{ fontSize: 12 }}>
                {t('encoder.jwt.hs256Only')}
              </Text>
            ) : null}
          </Flex>

          <Text strong>{t('encoder.jwt.signature')}</Text>
          <Flex gap={8} align="center">
            <Text code style={{ wordBreak: 'break-all', fontSize: 12 }}>
              {decoded.signature || t('encoder.jwt.empty')}
            </Text>
            <CopyButton value={decoded.signature} />
          </Flex>
        </>
      ) : null}
    </Flex>
  );
};

export default JwtPanel;
