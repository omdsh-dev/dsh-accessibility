/** Current authoring candidate; historical evidence keeps its original versions. */
export const AUTHORING_DSH_VERSION = '0.2.0-rc.2'
export const AUTHORING_COMPOSITION_VERSION = '0.1.0-alpha.1'
export const AUTHORING_LAB_VERSION = '0.1.3-rc.1'

export function assertAuthoringBaseline(dsh, composition, lab) {
  if (dsh.version !== AUTHORING_DSH_VERSION) {
    throw new Error('authoring lab requires DSH ' + AUTHORING_DSH_VERSION)
  }
  if (composition.name !== '@oh-my-dsh/dsh-a11y-local-preview'
    || composition.version !== AUTHORING_COMPOSITION_VERSION) {
    throw new Error('authoring lab requires the exact local-preview candidate')
  }
  if (lab.name !== '@oh-my-dsh/dsh-accessibility' || lab.version !== AUTHORING_LAB_VERSION) {
    throw new Error('authoring lab requires the exact accessibility-lab candidate')
  }
}
