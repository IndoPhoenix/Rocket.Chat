import { Box, SidebarV2CollapseGroup } from '@rocket.chat/fuselage';
import { useResizeObserver } from '@rocket.chat/fuselage-hooks';
import { useUserPreference, useUserId } from '@rocket.chat/ui-contexts';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { GroupedVirtuoso } from 'react-virtuoso';

import { VirtuosoScrollbars } from '../../components/CustomScrollbars';
import { useOpenedRoom } from '../../lib/RoomManager';
import { useAvatarTemplate } from '../hooks/useAvatarTemplate';
import { useCollapsedGroups } from '../hooks/useCollapsedGroups';
import { usePreventDefault } from '../hooks/usePreventDefault';
import { useRoomList } from '../hooks/useRoomList';
import { useShortcutOpenMenu } from '../hooks/useShortcutOpenMenu';
import { useTemplateByViewMode } from '../hooks/useTemplateByViewMode';
import RoomListRow from './RoomListRow';
import RoomListRowWrapper from './RoomListRowWrapper';
import RoomListWrapper from './RoomListWrapper';

const RoomList = () => {
	const { t } = useTranslation();
	const isAnonymous = !useUserId();

	const { collapsedGroups, handleClick, handleKeyDown } = useCollapsedGroups();
	const { groupsCount, groupsList, roomList } = useRoomList({ collapsedGroups });
	const avatarTemplate = useAvatarTemplate();
	const sideBarItemTemplate = useTemplateByViewMode();
	const { ref } = useResizeObserver<HTMLElement>({ debounceDelay: 100 });
	const openedRoom = useOpenedRoom() ?? '';
	const sidebarViewMode = useUserPreference<'extended' | 'medium' | 'condensed'>('sidebarViewMode') || 'extended';

	const extended = sidebarViewMode === 'extended';
	const itemData = useMemo(
		() => ({
			extended,
			t,
			SidebarItemTemplate: sideBarItemTemplate,
			AvatarTemplate: avatarTemplate,
			openedRoom,
			sidebarViewMode,
			isAnonymous,
		}),
		[avatarTemplate, extended, isAnonymous, openedRoom, sideBarItemTemplate, sidebarViewMode, t],
	);

	usePreventDefault(ref);
	useShortcutOpenMenu(ref);

	return (
		<Box position='relative' display='flex' overflow='hidden' height='full' flexGrow={1} flexShrink={1} flexBasis='auto' ref={ref}>
			<GroupedVirtuoso
				groupCounts={groupsCount}
				groupContent={(index) => (
					<SidebarV2CollapseGroup
						title={t(groupsList[index])}
						onClick={() => handleClick(groupsList[index])}
						onKeyDown={(e) => handleKeyDown(e, groupsList[index])}
						expanded={!collapsedGroups.includes(groupsList[index])}
					/>
				)}
				{...(roomList.length > 0 && {
					itemContent: (index) => roomList[index] && <RoomListRow data={itemData} item={roomList[index]} />,
				})}
				components={{ Item: RoomListRowWrapper, List: RoomListWrapper, Scroller: VirtuosoScrollbars }}
			/>
		</Box>
	);
};

export default RoomList;
