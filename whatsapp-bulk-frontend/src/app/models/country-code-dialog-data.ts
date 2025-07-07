export interface CountryCodeDialogData {
    excelColumns: string[];
    currentOption?: 'without' | 'with' | 'column';
    selectedCode?: string;
    selectedColumn?: string;
    excelData: any[]; // add this
  };
