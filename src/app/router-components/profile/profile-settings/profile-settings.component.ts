import { UpdatePasswordRequest } from './../../../models/requests';
import { ToastMessageService } from './../../../services/utils/toast-message.service';
import { FormControl } from '@angular/forms';
import { ProfileInfo } from './../../../models/models';
import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { ProfileInfoService } from 'src/app/services/http/profile-info.service';
import { UpdateProfileRequest } from 'src/app/models/requests';

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

  constructor(private profileService: ProfileInfoService, private cd: ChangeDetectorRef, private messageService: ToastMessageService) { }

  public setProfileInfo(val: ProfileInfo): void{
    this.profileInfo = val;
    this.emailControl.setValue(val.email);
    this.cd.markForCheck();
  }

  ngOnInit(): void {
    this.profileService.getProfileInfo().subscribe(val =>{
      this.setProfileInfo(val);
    }, this.redirectToPageError);
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

  public emailChangeConfirmed(newEmail: any): void{
    let request = this.generateUpdateRequest();
    request.email = newEmail;
    this.updateProfile(request);
  }


  public updateProfile(request: UpdateProfileRequest){
    this.waitingForResponse = true;

    this.profileService.updateProfileInfo(request).subscribe(info =>{
      this.setProfileInfo(info);
      this.waitingForResponse = false;
      this.messageService.showMessage({severity: "success", summary: "Sukces", detail: "Pomyślnie zmieniono email"})
    }, error=>{
      const details = error.error.info ? error.error.info : "Nie udało się zmienić email'a";
      this.waitingForResponse = false;
      this.messageService.showMessage({severity: "error", summary: "Niepowodzenie", detail: details})
      this.cd.markForCheck();
    });
  }

  private generateUpdateRequest(): UpdateProfileRequest{
    return {email: this.emailControl.value};
  }

  private redirectToPageError(){

  }

}
