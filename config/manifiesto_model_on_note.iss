; OnNote Setup
[Setup]
AppName=OnNote Sofware
DefaultDirName={autopf}\OnNote
AppVersion=1.0
AppPublisher=Bran-bit-lab & Gabmart1995.
DisableDirPage=no
DisableWelcomePage=no
WizardImageFile=":wizardPath"

[Icons]
Name: "{commondesktop}\OnNote" ; FileName: "{app}\on-note.EXE" ; IconFilename: ":iconDesktop"

[Languages]
Name: "es"; MessagesFile: "compiler:Languages\Spanish.isl";
Name: "en"; MessagesFile: "compiler:Default.isl";

[Files]
Source: ":path"; DestDir: "{app}"; Flags: "recursesubdirs"