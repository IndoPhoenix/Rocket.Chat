import { MessageGenericPreview } from '@rocket.chat/fuselage';
import type { ReactElement, ReactNode } from 'react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import MessageCollapsible from '../../MessageCollapsible';
import OEmbedPreviewContent from './OEmbedPreviewContent';
import type { OEmbedPreviewMetadata } from './OEmbedPreviewMetadata';

type OEmbedCollapsibleProps = { children?: ReactNode } & OEmbedPreviewMetadata;

const OEmbedCollapsible = ({ children, ...props }: OEmbedCollapsibleProps): ReactElement => {
	const { t } = useTranslation();

	return (
		<MessageCollapsible title={t('Link_Preview')}>
			<MessageGenericPreview>
				{children}
				<OEmbedPreviewContent {...props} />
			</MessageGenericPreview>
		</MessageCollapsible>
	);
};

export default OEmbedCollapsible;
