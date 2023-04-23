

[Setup]
AppName=OnNote Sofware
DefaultDirName={autopf}\OnNote
AppVersion=1.0
AppPublisher=bran-bit-lab & gabmart1995.
DisableDirPage=no
DisableWelcomePage=no
WizardImageFile="C:\Users\Brandon\Desktop\productos-app\config\icons\on-note410x798.bmp"

[Languages]
Name: "en"; MessagesFile: "compiler:Default.isl";
Name: "es"; MessagesFile: "compiler:Languages\Spanish.isl";
                                                                           
[Icons]
Name:"{commondesktop}\OnNote" ; Filename:"{app}\on-note.EXE" ; IconFilename: "{app}\resources\app\src\icons\on-note65x65.ico"
[Files]
Source: "C:\Users\Brandon\Desktop\productos-app\out\on-note-win32-ia32\*"; DestDir: "{app}"; Flags: "recursesubdirs"
