import { ConstructionSite } from "./ConstructionSite.model";

/** Simplified model used in the UI (derived from the API ConstructionSite) */
export interface SiteModel {
  id: number;
  name: string;
  address: string;
  managerName: string;
  managerId?: number;
  createdAt: string;
  updatedAt: string;
}

/** Maps an API ConstructionSite (with nested manager Account) into a UI-friendly SiteModel */
export function mapToSiteModel(site: ConstructionSite): SiteModel {
  return {
    id: site.id,
    name: site.name,
    address: site.address,
    managerName: site.manager
      ? `${site.manager.firstname} ${site.manager.lastname}`
      : "—",
    managerId: site.manager?.id,
    createdAt: site.createdAt,
    updatedAt: site.updatedAt,
  };
}
