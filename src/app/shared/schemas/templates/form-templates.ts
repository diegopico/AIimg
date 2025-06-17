export const FORM_TEMPLATES = {
    // Template HTML base para el formulario
    baseLayout: `
        <app-loading *ngIf="loading" />
        
        <mat-card class="$cardClass">
            <mat-card-header>
                <mat-card-title>{{ title }}</mat-card-title>
                <mat-card-subtitle>{{ description }}</mat-card-subtitle>
            </mat-card-header>
        
            <form [formGroup]="form" (ngSubmit)="onSubmit()">
                <mat-card-content class="$contentClass">
                    <div class="row">
                        $fields
                    </div>
                </mat-card-content>
        
                <mat-card-actions align="$actionsAlignment" class="$actionsClass">
                    $buttons
                </mat-card-actions>
            </form>
        </mat-card>
    `,

    // Templates para diferentes tipos de campos
    fields: {
        // Campo de texto/número/email
        text: `
            <div class="$gridColumn">
                <mat-form-field appearance="outline" class="w-100">
                    <mat-label>$label</mat-label>
                    <input matInput 
                        formControlName="$name" 
                        placeholder="$placeholder"
                        type="$inputType">
                    $errors
                </mat-form-field>
            </div>
        `,
        
        // Campo select
        select: `
            <div class="$gridColumn">
                <mat-form-field appearance="outline" class="w-100">
                    <mat-label>$label</mat-label>
                    <mat-select formControlName="$name">
                        <mat-option *ngFor="let opt of $optionsVar" [value]="opt.value">
                            {{opt.label}}
                        </mat-option>
                    </mat-select>
                    $errors
                </mat-form-field>
            </div>
        `,
        
        // Campo textarea
        textarea: `
            <div class="$gridColumn">
                <mat-form-field appearance="outline" class="w-100">
                    <mat-label>$label</mat-label>
                    <textarea matInput 
                        formControlName="$name" 
                        rows="$rows" 
                        placeholder="$placeholder"></textarea>
                    $errors
                </mat-form-field>
            </div>
        `,
        
        // Campo checkbox
        checkbox: `
            <div class="$gridColumn">
                <mat-checkbox formControlName="$name" color="primary">
                    $label
                </mat-checkbox>
            </div>
        `,

        // Campo de fecha
        date: `
            <div class="$gridColumn">
                <mat-form-field appearance="outline" class="w-100">
                    <mat-label>$label</mat-label>
                    <input matInput [matDatepicker]="$pickerName" 
                        formControlName="$name" 
                        placeholder="$placeholder">
                    <mat-datepicker-toggle matSuffix [for]="$pickerName"></mat-datepicker-toggle>
                    <mat-datepicker #$pickerName></mat-datepicker>
                    $errors
                </mat-form-field>
            </div>
        `
    },

    // Template para mensajes de error
    error: `
        <mat-error *ngIf="f['$name'].errors?.['$validationType']">
            $errorMessage
        </mat-error>
    `,

    // Template para botones
    button: `
        <button mat-$style
            $color
            type="$type"
            $disabled
            (click)="$action">
            $text
        </button>
    `,

    // Estilos base
    styles: `
        .cardWithShadow {
            margin: 24px;
            box-shadow: 0px 7px 30px 0px rgba(90, 114, 123, 0.11) !important;
            border-radius: 8px;
        }

        .mat-mdc-card-header {
            padding: 24px 24px 0;
        }

        .mat-mdc-card-title {
            font-size: 1.8rem;
            font-weight: 500;
            margin-bottom: 8px;
        }

        .mat-mdc-card-subtitle {
            font-size: 1rem;
            color: rgba(0, 0, 0, 0.6);
        }

        mat-form-field {
            .mat-mdc-text-field-wrapper {
                background-color: #fff;
            }
        }

        mat-checkbox {
            margin-bottom: 16px;
        }

        .mt-3 {
            margin-top: 1rem !important;
        }
    `
}; 