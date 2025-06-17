export interface FormConfig {
    name: string;
    title: {
        create: string;
        edit: string;
        createDescription?: string;
        editDescription?: string;
    };
    apis: {
        get: string;
        save: string;
        update?: string;
    };
    layout: {
        type: 'material-card';
        useLoading: boolean;
        globalClasses: {
            card: string;
            content: string;
            row: string;
            fullWidth: string;
        };
    };
    fields: FormField[];
    actions: {
        alignment: 'start' | 'center' | 'end';
        buttons: FormButton[];
    };
    navigation: {
        cancel: string;
        success: string;
    };
}

export interface FormField {
    name: string;
    label: string;
    type: 'text' | 'number' | 'email' | 'select' | 'textarea' | 'checkbox' | 'date';
    gridColumn: string;
    required?: boolean;
    placeholder?: string;
    defaultValue?: any;
    rows?: number;
    options?: Array<{value: any; label: string}>;
    validators?: {
        required?: string;
        minLength?: {
            value: number;
            message: string;
        };
        maxLength?: {
            value: number;
            message: string;
        };
        pattern?: {
            value: string;
            message: string;
        };
        email?: string;
        min?: {
            value: number;
            message: string;
        };
        max?: {
            value: number;
            message: string;
        };
    };
}

export interface FormButton {
    text: string | {
        create: string;
        edit: string;
    };
    type: 'button' | 'submit';
    style: 'mat-button' | 'mat-raised-button' | 'mat-stroked-button' | 'mat-flat-button';
    color?: 'primary' | 'accent' | 'warn';
    action: 'save' | 'cancel' | string;
} 