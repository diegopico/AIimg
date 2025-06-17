export interface NavItem {
    displayName?: string;
    disabled?: boolean;
    external?: boolean;
    twoLines?: boolean;
    chip?: boolean;
    iconName?: string;
    iconColor?: any;
    navCap?: string;
    chipContent?: string;
    chipClass?: string;
    Class?: any;
    subtext?: string;
    route?: string;
    children?: NavItem[];
    ddType?: string;
}