// Workflow Versioning Service
// Template version control

import { Injectable, Logger } from '@nestjs/common';
import { WorkflowVersion } from './types';
import { InMemoryStore } from './store';

@Injectable()
export class VersioningService {
  private readonly logger = new Logger(VersioningService.name);
  private versions = new InMemoryStore<WorkflowVersion>();
  private templateVersions = new Map<string, number[]>();

  createVersion(
    data: Omit<WorkflowVersion, 'id' | 'version' | 'createdAt'>,
  ): WorkflowVersion {
    const currentVersions = this.templateVersions.get(data.templateId) || [];
    const nextVersion = currentVersions.length > 0 
      ? Math.max(...currentVersions) + 1 
      : 1;

    const version: WorkflowVersion = {
      ...data,
      id: this.generateId(),
      version: nextVersion,
      createdAt: new Date(),
    };

    this.versions.set(version.id, version);

    // Track version numbers
    currentVersions.push(nextVersion);
    this.templateVersions.set(data.templateId, currentVersions);

    // Deactivate previous active version
    if (data.isActive) {
      this.deactivateOtherVersions(data.templateId, version.id);
    }

    this.logger.log(
      `Created version ${nextVersion} for template ${data.templateId}`,
    );

    return version;
  }

  getVersion(id: string): WorkflowVersion | undefined {
    return this.versions.get(id);
  }

  getVersionByNumber(
    templateId: string,
    versionNumber: number,
  ): WorkflowVersion | undefined {
    return this.versions.find(
      v => v.templateId === templateId && v.version === versionNumber,
    );
  }

  getActiveVersion(templateId: string): WorkflowVersion | undefined {
    return this.versions.find(
      v => v.templateId === templateId && v.isActive,
    );
  }

  getAllVersions(templateId: string): WorkflowVersion[] {
    return this.versions
      .filter(v => v.templateId === templateId)
      .sort((a, b) => b.version - a.version);
  }

  activateVersion(id: string): WorkflowVersion | null {
    const version = this.versions.get(id);
    if (!version) {
      return null;
    }

    // Deactivate others
    this.deactivateOtherVersions(version.templateId, id);

    // Activate this one
    version.isActive = true;
    this.versions.set(id, version);

    this.logger.log(
      `Activated version ${version.version} for template ${version.templateId}`,
    );

    return version;
  }

  compareVersions(
    versionId1: string,
    versionId2: string,
  ): { added: string[]; removed: string[]; modified: string[] } | null {
    const v1 = this.versions.get(versionId1);
    const v2 = this.versions.get(versionId2);

    if (!v1 || !v2) {
      return null;
    }

    const stages1 = new Set(v1.stages.map(s => s.id));
    const stages2 = new Set(v2.stages.map(s => s.id));

    const added = v2.stages
      .filter(s => !stages1.has(s.id))
      .map(s => s.name || s.id);

    const removed = v1.stages
      .filter(s => !stages2.has(s.id))
      .map(s => s.name || s.id);

    // Find modified (same ID, different content)
    const modified: string[] = [];
    v1.stages.forEach(s1 => {
      const s2 = v2.stages.find(s => s.id === s1.id);
      if (s2 && JSON.stringify(s1) !== JSON.stringify(s2)) {
        modified.push(s1.name || s1.id);
      }
    });

    return { added, removed, modified };
  }

  rollbackToVersion(
    templateId: string,
    versionNumber: number,
  ): WorkflowVersion | null {
    const version = this.getVersionByNumber(templateId, versionNumber);
    if (!version) {
      return null;
    }

    // Create a new version based on the old one
    return this.createVersion({
      templateId,
      name: `Rollback to v${versionNumber}`,
      description: `Rolled back from v${versionNumber}`,
      stages: version.stages,
      createdBy: 'system',
      isActive: true,
      changelog: `Rolled back to version ${versionNumber}`,
    });
  }

  deleteVersion(id: string): boolean {
    const version = this.versions.get(id);
    if (!version) {
      return false;
    }

    // Cannot delete active version
    if (version.isActive) {
      throw new Error('Cannot delete active version');
    }

    // Remove from tracking
    const versions = this.templateVersions.get(version.templateId) || [];
    const idx = versions.indexOf(version.version);
    if (idx >= 0) {
      versions.splice(idx, 1);
      this.templateVersions.set(version.templateId, versions);
    }

    return this.versions.delete(id);
  }

  private deactivateOtherVersions(templateId: string, exceptId: string): void {
    const others = this.versions.filter(
      v => v.templateId === templateId && v.id !== exceptId && v.isActive,
    );

    others.forEach(v => {
      v.isActive = false;
      this.versions.set(v.id, v);
    });
  }

  private generateId(): string {
    return `ver_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }
}
