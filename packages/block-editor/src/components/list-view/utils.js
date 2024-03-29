/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import { focus } from '@wordpress/dom';

export const getBlockPositionDescription = ( position, siblingCount, level ) =>
	sprintf(
		/* translators: 1: The numerical position of the block. 2: The total number of blocks. 3. The level of nesting for the block. */
		__( 'Block %1$d of %2$d, Level %3$d' ),
		position,
		siblingCount,
		level
	);

/**
 * Returns true if the client ID occurs within the block selection or multi-selection,
 * or false otherwise.
 *
 * @param {string}          clientId               Block client ID.
 * @param {string|string[]} selectedBlockClientIds Selected block client ID, or an array of multi-selected blocks client IDs.
 *
 * @return {boolean} Whether the block is in multi-selection set.
 */
export const isClientIdSelected = ( clientId, selectedBlockClientIds ) =>
	Array.isArray( selectedBlockClientIds ) && selectedBlockClientIds.length
		? selectedBlockClientIds.indexOf( clientId ) !== -1
		: selectedBlockClientIds === clientId;

/**
 * From a start and end clientId of potentially different nesting levels,
 * return the nearest-depth ids that have a common level of depth in the
 * nesting hierarchy. For multiple block selection, this ensure that the
 * selection is always at the same nesting level, and not split across
 * separate levels.
 *
 * @param {string}   startId      The first id of a selection.
 * @param {string}   endId        The end id of a selection, usually one that has been clicked on.
 * @param {string[]} startParents An array of ancestor ids for the start id, in descending order.
 * @param {string[]} endParents   An array of ancestor ids for the end id, in descending order.
 * @return {Object} An object containing the start and end ids.
 */
export function getCommonDepthClientIds(
	startId,
	endId,
	startParents,
	endParents
) {
	const startPath = [ ...startParents, startId ];
	const endPath = [ ...endParents, endId ];
	const depth = Math.min( startPath.length, endPath.length ) - 1;
	const start = startPath[ depth ];
	const end = endPath[ depth ];

	return {
		start,
		end,
	};
}

/**
 * Shift focus to the list view item associated with a particular clientId.
 *
 * @typedef {import('@wordpress/element').RefObject} RefObject
 *
 * @param {string}                 focusClientId      The client ID of the block to focus.
 * @param {RefObject<HTMLElement>} treeGridElementRef The container element to search within.
 */
export function focusListItem( focusClientId, treeGridElementRef ) {
	const getFocusElement = () => {
		const row = treeGridElementRef.current?.querySelector(
			`[role=row][data-block="${ focusClientId }"]`
		);
		if ( ! row ) return null;
		// Focus the first focusable in the row, which is the ListViewBlockSelectButton.
		return focus.focusable.find( row )[ 0 ];
	};

	let focusElement = getFocusElement();
	if ( focusElement ) {
		focusElement.focus();
	} else {
		// The element hasn't been painted yet. Defer focusing on the next frame.
		// This could happen when all blocks have been deleted and the default block
		// hasn't been added to the editor yet.
		window.requestAnimationFrame( () => {
			focusElement = getFocusElement();

			// Ignore if the element still doesn't exist.
			if ( focusElement ) {
				focusElement.focus();
			}
		} );
	}
}
