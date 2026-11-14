import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Flex, Input, Progress, Select, Space, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import CopyButton from '../CopyButton';
import {
  TOTP_ALGORITHMS,
  TotpAlgorithm,
  buildOtpAuthUrl,
  generateTotp,
  totpRemainingSeconds,
} from '../../utils/totp';
import { translateError } from '../../i18n/translateError';
import dayjs from 'dayjs';

const { Text, Title } = Typography;

export default function TotpTool() {
  const { t } = useTranslation();
  const [secret, setSecret] = useState('JBSWY3DPEHPK3PXP');
  const [digits, setDigits] = useState(6);
  const [period, setPeriod] = useState(30);
  const [algorithm, setAlgorithm] = useState<TotpAlgorithm>('SHA1');
  const [issuer, setIssuer] = useState('');
  const [account, setAccount] = useState('');
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const totp = useMemo(() => {
    try {
      return {
        code: generateTotp(secret, {
          timestamp: now,
          digits,
          period,
          algorithm,
        }),
        error: null,
      };
    } catch (error) {
      return { code: null, error: translateError(t, error) };
    }
  }, [secret, digits, period, algorithm, now, t]);

  const remaining = totpRemainingSeconds(period, now);
  const progress = Math.round(((period - remaining) / period) * 100);

  const otpAuthUrl = useMemo(() => {
    if (!totp.code) {
      return '';
    }
    try {
      return buildOtpAuthUrl({
        secret,
        issuer,
        account: account || 'user',
        digits,
        period,
        algorithm,
      });
    } catch {
      return '';
    }
  }, [totp.code, secret, issuer, account, digits, period, algorithm]);

  return (
    <Flex vertical gap={16} style={{ maxWidth: 760 }}>
      <Flex wrap gap={12} align="center">
        <Input
          value={secret}
          onChange={event => setSecret(event.target.value)}
          placeholder={t('totp.secretPlaceholder')}
          style={{ width: 320, fontFamily: 'monospace' }}
          addonBefore={t('totp.secret')}
        />
        <Select
          value={digits}
          onChange={setDigits}
          style={{ width: 110 }}
          options={[6, 8].map(value => ({
            value,
            label: `${value} ${t('totp.digits')}`,
          }))}
        />
        <Select
          value={period}
          onChange={setPeriod}
          style={{ width: 110 }}
          options={[30, 60].map(value => ({
            value,
            label: `${value}s`,
          }))}
        />
        <Select
          value={algorithm}
          onChange={setAlgorithm}
          style={{ width: 120 }}
          options={TOTP_ALGORITHMS.map(value => ({ value, label: value }))}
        />
      </Flex>

      {totp.error && <Alert type="error" showIcon message={totp.error} />}

      {totp.code && (
        <Flex
          gap={24}
          align="center"
          wrap
          style={{
            padding: '16px 20px',
            border: '1px solid #f0f0f0',
            borderRadius: 8,
          }}>
          <Progress
            type="circle"
            size={84}
            percent={progress}
            status="active"
            format={() => remaining}
          />
          <Flex vertical gap={6}>
            <Text type="secondary">{t('totp.currentCode')}</Text>
            <Space>
              <Title
                level={1}
                style={{
                  margin: 0,
                  fontFamily: 'monospace',
                  letterSpacing: 6,
                }}>
                {totp.code}
              </Title>
              <CopyButton value={totp.code} />
            </Space>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {t('totp.refreshHint', {
                seconds: remaining,
                time: dayjs(now).format('HH:mm:ss'),
              })}
            </Text>
          </Flex>
        </Flex>
      )}

      <Flex wrap gap={12} align="center">
        <Input
          value={issuer}
          onChange={event => setIssuer(event.target.value)}
          placeholder={t('totp.issuerPlaceholder')}
          addonBefore={t('totp.issuer')}
          style={{ width: 240 }}
        />
        <Input
          value={account}
          onChange={event => setAccount(event.target.value)}
          placeholder={t('totp.accountPlaceholder')}
          addonBefore={t('totp.account')}
          style={{ width: 240 }}
        />
      </Flex>

      {otpAuthUrl && (
        <Space.Compact style={{ width: '100%' }}>
          <Input
            value={otpAuthUrl}
            readOnly
            style={{ fontFamily: 'monospace' }}
            addonBefore={t('totp.otpAuthUrl')}
          />
          <CopyButton value={otpAuthUrl} />
        </Space.Compact>
      )}

      <Alert
        type="info"
        showIcon
        message={t('totp.privacy')}
        style={{ fontSize: 12 }}
      />
    </Flex>
  );
}
