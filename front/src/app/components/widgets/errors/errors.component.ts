import { Component, OnInit, TemplateRef, ViewChild, Input } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Subscription } from 'rxjs';
import { UtilitiesService } from 'src/app/services/general/utilities.service';

@Component({
    selector: 'app-errors',
    templateUrl: './errors.component.html',
    styleUrls: ['./errors.component.scss']
})
export class ErrorsComponent implements OnInit {

    private unsubscribes: Subscription[] = [];
    @Input() message: string;

    modalRef: BsModalRef;
    @ViewChild('modalErrors') modalErrors: TemplateRef<any>;

    constructor(
        private modalService: BsModalService,
        private ut: UtilitiesService,
    ) { }

    ngOnInit() {

        const errorsSubs = this.ut._showErrorsModal.subscribe(res => {
            this.message= res.message;
            this.openModal(this.modalErrors, res.res);
        });
        this.unsubscribes.push(errorsSubs);

    }

    ngOnDestroy() {

        this.unsubscribes.forEach(sb => sb.unsubscribe());

    }

    openModal(template: TemplateRef<any>, res: boolean = false) {

        this.modalRef = this.modalService.show(
            template,
            Object.assign({backdrop : 'static'}, { class: 'gray modal-md cf-modal' })
        );

    }

    closeModal() {

        this.modalRef.hide();

    }

}
