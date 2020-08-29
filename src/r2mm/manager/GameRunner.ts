import ManagerSettings from './ManagerSettings';

import * as child from 'child_process';
import * as path from 'path';
import GameDirectoryResolver from './GameDirectoryResolver';
import R2Error from 'src/model/errors/R2Error';
import { Logger, LogSeverity } from '../logging/Logger';
import { exec } from 'child_process';

export default class GameRunner {

    public static playModded(ror2Directory: string, onComplete: (err: R2Error | null) => void) {
        Logger.Log(LogSeverity.INFO, 'Launching modded');
        const settings = ManagerSettings.getSingleton();
        const steamDir: string | R2Error = GameDirectoryResolver.getDirectory();
        if (steamDir instanceof R2Error) {
            onComplete(steamDir);
            return;
        }
	const drive = steamDir.substring(0,2);
	Logger.Log(LogSeverity.INFO, `Game Drive is: ${drive}`);
        Logger.Log(LogSeverity.INFO, `Game directory is: ${steamDir}`);
        Logger.Log(LogSeverity.INFO, `Running command: cmd /C "${drive} & cd ${steamDir} & steamclient_loader.exe"`);
        exec(`cmd /C "${drive} & cd ${steamDir} & steamclient_loader.exe"`, (err => {
            if (err !== null) {
                Logger.Log(LogSeverity.ACTION_STOPPED, 'Error was thrown whilst starting modded');
                Logger.Log(LogSeverity.ERROR, err.message);
                onComplete(new R2Error('Error starting Steam', err.message, 'Ensure that the Steam directory has been set correctly in the settings'));
            }
        }));
    }

    public static playVanilla(ror2Directory: string, onComplete: (err: R2Error | null) => void) {
        Logger.Log(LogSeverity.INFO, 'Launching vanilla');
        const settings = ManagerSettings.getSingleton();
        const steamDir: string | R2Error = GameDirectoryResolver.getSteamDirectory();
        if (steamDir instanceof R2Error) {
            onComplete(steamDir);
            return;
        }
        Logger.Log(LogSeverity.INFO, `Steam directory is: ${steamDir}`);
        Logger.Log(LogSeverity.INFO, `Running command: ${steamDir}.exe -applaunch 632360 --doorstop-enable false`);
        exec(`"${steamDir}/Steam.exe" -applaunch 632360 --doorstop-enable false ${settings.launchParameters}`, (err => {
            if (err !== null) {
                Logger.Log(LogSeverity.ACTION_STOPPED, 'Error was thrown whilst starting modded');
                Logger.Log(LogSeverity.ERROR, err.message);
                onComplete(new R2Error('Error starting Steam', err.message, 'Ensure that the Steam directory has been set correctly in the settings'));
            }
        }));
    }


}
