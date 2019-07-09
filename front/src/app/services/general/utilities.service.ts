import { EventEmitter, Injectable, Output } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class UtilitiesService {
  @Output() _toggleSplashscreen: EventEmitter<
    boolean
  > = new EventEmitter();
  @Output() _showErrorsModal: EventEmitter<
    object
  > = new EventEmitter();
  @Output() _showConfirmModal: EventEmitter<
    object
  > = new EventEmitter();
  @Output() _responseModalConfirm: EventEmitter<
    boolean
  > = new EventEmitter();
  @Output() setStepBreadCrumbs: EventEmitter<
    number
  > = new EventEmitter();
  @Output() showHideUserAppointment: EventEmitter<
    boolean
  > = new EventEmitter();

  constructor() {}

  setLocalSession(data: object, name: string) {
    localStorage.setItem(name, JSON.stringify(data));
  }

  geLocalSessionData(name) {
    let response = localStorage.getItem(name);

    if (!response) {
      return;
    }
    return JSON.parse(response);
  }

  destroyLocalSession(name: string) {
    localStorage.removeItem(name);
  }

  convertDateFormat(_date: any, _format: string) {
    const year = _date.year;
    const month = _date.month;
    const day = _date.day;

    let date = year + '/' + month + '/' + day;

    if (year && month && day) {
      return moment(date).format(_format);
    } else {
      return moment(_date).format(_format);
    }
  }

  convertDateObject(_date: string) {
    let date: Object = {
      date: {
        year: parseInt(_date.split('-')[0]),
        month: parseInt(_date.split('-')[1]),
        day: parseInt(_date.split('-')[2]),
      },
    };

    return date;
  }

  toggleSplashscreen(_value: boolean) {
    this._toggleSplashscreen.emit(_value);
  }

  showErrorsModal(_value: boolean, _message: String) {
    let object = {
      res: _value,
      message: _message,
    };
    this._showErrorsModal.emit(object);
  }

  showConfirmModal(
    _value: boolean,
    _title: String,
    _message: String,
  ) {
    let object = {
      res: _value,
      title: _title,
      message: _message,
    };
    this._showConfirmModal.emit(object);
  }

  responseConfirmModal(res: boolean) {
    this._responseModalConfirm.emit(res);
  }

  validateNumer(_value: string) {
    let regex = /^[0-9]{1,}$/;
    return regex.test(_value);
  }

  validateEmail(_value: string) {
    let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(_value);
  }

  validateExtension(limit: number, _value: String) {
    if (_value.length > limit) {
      return true;
    }
    return false;
  }

  validateNumber(_value: string) {
    let regex = /^[0-9]+$/;
    return regex.test(_value);
  }

  getStepBreadCrumbs(_value: number) {
    this.setStepBreadCrumbs.emit(_value);
  }

  getshowHideAppointmenUser(_value: boolean) {
    this.showHideUserAppointment.emit(_value);
  }
}
