// Core Entity Transformers
// Transform ApiUser, ApiCase, ApiParty, ApiCaseMember

import { ApiUser, ApiCase, ApiParty, ApiCaseMember, ApiOrganization } from '../../shared-types';
import { User, Case, Party, CaseMember, Organization } from '../../types';

export function transformApiUser(apiUser: ApiUser): User {
  return {
    id: apiUser.id,
    firstName: apiUser.first_name,
    lastName: apiUser.last_name,
    name: apiUser.name,
    email: apiUser.email,
    role: apiUser.role,
    position: apiUser.position,
    office: apiUser.office || apiUser.position,
    barAdmission: apiUser.bar_admission,
    barNumber: apiUser.bar_number,
    phone: apiUser.phone,
    expertise: apiUser.expertise,
    organizationId: apiUser.organization_id,
    orgId: apiUser.organization_id,
    userType: (apiUser.user_type as 'Internal' | 'External') || 'Internal',
    avatar: apiUser.avatar,
    status: apiUser.status as any,
    lastActive: typeof apiUser.last_active === 'string'
      ? apiUser.last_active
      : apiUser.last_active?.toISOString(),
    createdAt: typeof apiUser.created_at === 'string'
      ? apiUser.created_at
      : apiUser.created_at?.toISOString(),
    updatedAt: typeof apiUser.updated_at === 'string'
      ? apiUser.updated_at
      : apiUser.updated_at?.toISOString(),
  };
}

export function transformApiParty(apiParty: ApiParty): Party {
  return {
    id: apiParty.id,
    name: apiParty.name,
    role: apiParty.role,
    contact: apiParty.contact,
    type: apiParty.type,
    counsel: apiParty.counsel,
    caseId: apiParty.case_id,
    linkedOrgId: apiParty.linked_org_id,
    createdAt: typeof apiParty.created_at === 'string'
      ? apiParty.created_at
      : apiParty.created_at?.toISOString(),
    updatedAt: typeof apiParty.updated_at === 'string'
      ? apiParty.updated_at
      : apiParty.updated_at?.toISOString(),
  };
}

export function transformApiCaseMember(apiMember: ApiCaseMember): CaseMember {
  return {
    id: apiMember.id,
    caseId: apiMember.case_id,
    userId: apiMember.user_id,
    role: apiMember.role,
    joinedAt: typeof apiMember.joined_at === 'string'
      ? apiMember.joined_at
      : apiMember.joined_at?.toISOString(),
    user: apiMember.user ? transformApiUser(apiMember.user) : undefined,
    createdAt: typeof apiMember.created_at === 'string'
      ? apiMember.created_at
      : apiMember.created_at?.toISOString(),
    updatedAt: typeof apiMember.updated_at === 'string'
      ? apiMember.updated_at
      : apiMember.updated_at?.toISOString(),
  };
}

export function transformApiCase(apiCase: ApiCase): Case {
  return {
    id: apiCase.id,
    title: apiCase.title,
    client: apiCase.client_name,
    clientName: apiCase.client_name,
    opposingCounsel: apiCase.opposing_counsel,
    status: apiCase.status,
    filingDate: typeof apiCase.filing_date === 'string'
      ? apiCase.filing_date
      : apiCase.filing_date?.toISOString(),
    description: apiCase.description,
    value: apiCase.value,
    matterType: apiCase.matter_type,
    jurisdiction: apiCase.jurisdiction,
    court: apiCase.court,
    billingModel: apiCase.billing_model,
    judge: apiCase.judge,
    ownerOrgId: apiCase.owner_org_id,
    createdBy: apiCase.created_by,
    parties: apiCase.parties?.map(transformApiParty),
    caseMembers: apiCase.case_members?.map(transformApiCaseMember),
    createdAt: typeof apiCase.created_at === 'string'
      ? apiCase.created_at
      : apiCase.created_at?.toISOString(),
    updatedAt: typeof apiCase.updated_at === 'string'
      ? apiCase.updated_at
      : apiCase.updated_at?.toISOString(),
  };
}

export function transformApiOrganization(apiOrg: ApiOrganization): Organization {
  return {
    id: apiOrg.id,
    name: apiOrg.name,
    type: apiOrg.type as any,
    domain: apiOrg.domain || apiOrg.website,
    logo: apiOrg.logo,
    status: apiOrg.status as any,
    address: apiOrg.address,
    phone: apiOrg.phone,
    email: apiOrg.email,
    website: apiOrg.website,
    subscriptionTier: apiOrg.subscription_tier,
    practiceAreas: apiOrg.practice_areas,
    taxId: apiOrg.tax_id,
    createdAt: typeof apiOrg.created_at === 'string'
      ? apiOrg.created_at
      : apiOrg.created_at?.toISOString(),
    updatedAt: typeof apiOrg.updated_at === 'string'
      ? apiOrg.updated_at
      : apiOrg.updated_at?.toISOString(),
  };
}
