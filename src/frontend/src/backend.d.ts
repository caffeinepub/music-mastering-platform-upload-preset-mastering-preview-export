import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface MasteringProject {
    id: string;
    status: ProjectStatus;
    trackBlob?: ExternalBlob;
    trackName: string;
    owner: Principal;
    createdAt: bigint;
    preset: string;
    finalMasterBlob?: ExternalBlob;
}
export interface UserProfile {
    name: string;
}
export enum ProjectStatus {
    pending = "pending",
    complete = "complete",
    processing = "processing",
    failed = "failed"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createProject(trackName: string, preset: string): Promise<string>;
    deleteProject(id: string): Promise<void>;
    getAllProjects(): Promise<Array<MasteringProject>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getProject(id: string): Promise<MasteringProject | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateProjectStatus(id: string, status: ProjectStatus): Promise<void>;
    uploadFinalMaster(id: string, blob: ExternalBlob): Promise<void>;
    uploadTrack(id: string, blob: ExternalBlob): Promise<void>;
}
