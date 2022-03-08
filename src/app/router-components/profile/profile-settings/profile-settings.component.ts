import { deepCopy } from 'src/app/models/models';
import { UpdateEmailRequest, UpdatePasswordRequest } from '../../../models/requests';
import { ToastMessageService } from '../../../services/utils/toast-message.service';
import { FormControl } from '@angular/forms';
import { EMPTY_USER_INFO, ProfileInfo, UserInfo } from '../../../models/models';
import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { ProfileInfoService } from 'src/app/services/http/profile-info.service';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileSettingsComponent implements OnInit {

  public profileInfo?: ProfileInfo;
  public emailDialogVisibility: boolean = false;
  public passwordDialogVisibility: boolean = false;
  public waitingForResponse: boolean = false;
  public emailControl: FormControl = new FormControl({value: '', disabled: true});
  public infoControl: FormControl = new FormControl({value: EMPTY_USER_INFO, disabled: true}, []);
  public _infoEditingMode: boolean = false;
  public backupModel?: UserInfo = EMPTY_USER_INFO;

  constructor(private profileService: ProfileInfoService, private cd: ChangeDetectorRef, private messageService: ToastMessageService) { }

  public set infoEditingMode(value: boolean){
    this._infoEditingMode = value;
    if(value) this.infoControl.enable();
    else this.infoControl.disable();
    this.cd.markForCheck();
  }
  public get infoEditingMode(): boolean{
    return this._infoEditingMode
  }

  public setProfileInfo(val: ProfileInfo): void{
    this.profileInfo = val;
    this.emailControl.setValue(val.email);
    this.infoControl.setValue(val.info);
    this.cd.markForCheck();
  }
  

  ngOnInit(): void {
    this.refreshInfo();
  }

  public refreshInfo(): void{
    this.waitingForResponse = true;
    this.profileService.getProfileInfo().subscribe(val =>{
      this.setProfileInfo(val);
      this.backupModel = deepCopy(val.info);
      this.waitingForResponse = false;
      this.cd.markForCheck();
    }, this.redirectToPageError.bind(this));
    this.cd.markForCheck();
  }

  public editConfirmClick(){
    if(this.infoEditingMode)
      this.editingConfimed();
    else
      this.editingStarted();
  }

  public editingConfimed(){
    if(!this.infoControl) return;
    this.infoEditingMode = false;
    this.cd.markForCheck();
    if(JSON.stringify(this.infoControl.value) === JSON.stringify(this.backupModel)) return;
    this.waitingForResponse = true;
    this.profileService.updateUserInfo(this.infoControl.value).subscribe(()=>{
      this.waitingForResponse = false;
      this.backupModel = deepCopy(this.infoControl.value);
      this.cd.markForCheck();
     this.messageService.showMessage({severity: "success", summary: "Sukces", detail: "Pomyślnie zmieniono dane"});
    }, error=>{
      this.waitingForResponse = false;
      this.messageService.showMessage({severity: "error", summary: "Niepowodzenie", detail: "Nie udało się zmienić danych"});
      this.refreshInfo();
    })
  }

  public editingCancelled(){
    this.infoControl.setValue(deepCopy(this.backupModel));
    this.infoEditingMode = false;
    this.cd.markForCheck();
  }

  public editingStarted(){
    this.infoEditingMode = true;
    this.cd.markForCheck();
  }

  public openEmailDialog(): void{
    this.emailDialogVisibility = true;
  }

  public openPasswordDialog(): void{
    this.passwordDialogVisibility = true;
  }

  public closeEmailDialog(): void{
    this.emailDialogVisibility = true;
  }
  
  public passwordChangeConfirmed(request: UpdatePasswordRequest){
    this.waitingForResponse = true;
    this.profileService.updatePassword(request).subscribe(()=>{
      this.waitingForResponse = false;
      this.messageService.showMessage({severity: "success", summary: "Sukces", detail: "Pomyślnie zmieniono hasło"});
      this.cd.markForCheck();
    }, ()=>{
      this.waitingForResponse = false;
      this.messageService.showMessage({severity: "error", summary: "Niepowodzenie", detail: "Nie udało się zmienić hasła"});
      this.cd.markForCheck();
    }) 
  }

  public emailChangeConfirmed(request: UpdateEmailRequest): void{
    this.updateEmail(request);
  }


  public updateEmail(request: UpdateEmailRequest){
    this.waitingForResponse = true;

    this.profileService.updateEmail(request).subscribe(info =>{
      this.setProfileInfo(info);
      this.waitingForResponse = false;
      this.messageService.showMessage({severity: "success", summary: "Sukces", detail: "Pomyślnie zmieniono email"})
    }, error=>{
      const details = error && error.error ? error.error.info : "Nie udało się zmienić email'a";
      this.waitingForResponse = false;
      this.messageService.showMessage({severity: "error", summary: "Niepowodzenie", detail: details})
      this.cd.markForCheck();
    });
  }

  private redirectToPageError(){

  }

}
