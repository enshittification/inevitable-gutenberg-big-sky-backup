/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose';
import { withSelect, withDispatch } from '@wordpress/data';
import { ifViewportMatches } from '@wordpress/viewport';
import { store as editorStore } from '@wordpress/editor';
import { privateApis as preferencesPrivateApis } from '@wordpress/preferences';

/**
 * Internal dependencies
 */
import { unlock } from '../../lock-unlock';

const { PreferenceBaseOption } = unlock( preferencesPrivateApis );

export default compose(
	withSelect( ( select ) => ( {
		isChecked: select( editorStore ).isPublishSidebarEnabled(),
	} ) ),
	withDispatch( ( dispatch ) => {
		const { enablePublishSidebar, disablePublishSidebar } =
			dispatch( editorStore );
		return {
			onChange: ( isEnabled ) =>
				isEnabled ? enablePublishSidebar() : disablePublishSidebar(),
		};
	} ),
	// In < medium viewports we override this option and always show the publish sidebar.
	// See the edit-post's header component for the specific logic.
	ifViewportMatches( 'medium' )
)( PreferenceBaseOption );
