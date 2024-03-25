import { isPlatformBrowser } from "@angular/common";
import { Inject, Injectable, PLATFORM_ID,  } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class WindowService {

  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) platformId: any
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  getWindow(): Window {
    if (this.isBrowser)
      return window as Window
    else
      return {} as Window
  }

}