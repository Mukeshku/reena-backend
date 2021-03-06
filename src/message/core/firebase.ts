import { Injectable } from '@nestjs/common';

import { default as messagingConfiguration }from '../../../config/firebase-configuration';
import { ProjectConfiguration, ProjectData } from './firebase.type';
const admin = require('firebase-admin');
@Injectable()
export class FireBase {
    private _projectItems = new Map<string, ProjectData>();

    private projects(): Array<ProjectConfiguration> {
        return messagingConfiguration.projects as ProjectConfiguration[];
    }

    configure(): void {
        const data = this.projects().forEach(project => {
            const ref = admin.initializeApp({
                credential: admin.credential.cert(project.serviceAccount),
                databaseURL: project.databaseURL,
            });
            const appData = { id: project.id, ref, serverKey: project.serverKey } as ProjectData;
            this._projectItems.set(appData.id, appData);
        });
    }

    getProjectData(projectId: string): ProjectData {
        const data = this._projectItems.get(projectId);
        if (!data) {
            throw new Error('project not found');
        }
        return data;
    }

    async sendNotification(projectId: string, token: string, notification: any): Promise<any> {
        try {
            const project = this.getProjectData(projectId);
            const data = { ...notification, token };
            return await admin.messaging(project.ref).send(data);
        } catch (error) {
            return Promise.reject(error);
        }
    }
}