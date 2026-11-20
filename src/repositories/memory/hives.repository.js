const RUCHES_INITIALES = [
  { id: "SN-CASA-001", site_id: "SN-CASA", status: "active" },
  { id: "SN-CASA-002", site_id: "SN-CASA", status: "active" },
  { id: "SN-CASA-003", site_id: "SN-CASA", status: "inactive" },
  { id: "SN-DAKA-001", site_id: "SN-DAKA", status: "active" },
  { id: "SN-DAKA-002", site_id: "SN-DAKA", status: "active" },
];

export function createMemoryHivesRepository(ruches = RUCHES_INITIALES) {
  return {
    async findAll({ siteId } = {}) {
      return siteId === undefined ? ruches : ruches.filter((h) => h.site_id === siteId);
    },
    async findById(id) {
      return ruches.find((h) => h.id === id);
    },
  };
}