import { Trans, useTranslation } from "react-i18next";

import H from "./H";

export function HanFuValue({ han, fu }: { han: string; fu: string }) {
  return <HTrans i18nKey="common.hanfuvalue" values={{ han, fu }} />;
}

export function HanValue({ han }: { han: string }) {
  return <HTrans i18nKey="common.hanvalue" values={{ han }} />;
}

export function FuValue({ fu }: { fu: string }) {
  return <HTrans i18nKey="common.fuvalue" values={{ fu }} />;
}

export function HTrans({
  i18nKey,
  values,
  defaults,
}: {
  i18nKey: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  values?: Record<any, any>;
  defaults?: string;
}) {
  const { t } = useTranslation();

  return (
    <Trans
      t={t}
      i18nKey={i18nKey}
      components={{ H: <H />, B: <H.B />, R: <H.Red /> }}
      values={values}
      defaults={defaults}
    />
  );
}
