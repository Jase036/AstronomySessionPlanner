
// Column configuration options for the catalog data grid
export const columns = [
    { 
        field: 'name',
        headerName: 'Catalog Name',
        numeric: false,
        disablePadding: true,
        editable: false,
        width: 130,
        valueGetter: (params) => params.row.fields.name
    },
    { 
        field: 'common_names', 
        headerName: 'Common Names',
        numeric: false, 
        disablePadding: true,
        editable: false,
        width: 180, 
        valueGetter: (params) => params.row.fields.common_names,
    },
    {
        field: 'v_mag',
        headerName: 'Magnitude',
        numeric: true,
        disablePadding: false,
        editable: false,
        width: 120, 
        valueGetter: (params) => params.row.fields.v_mag,
    },
    {
        field: 'object_definition',
        headerName: 'Object Type',
        numeric: false,
        disablePadding: true,
        editable: false,
        width: 140, 
        valueGetter: (params) => params.row.fields.object_definition,
    },
    {
        field: 'ra',
        headerName: 'RA',
        numeric: false,
        disablePadding: true,
        editable: false,
        width: 140, 
        valueGetter: (params) => params.row.fields.ra,
    },
    {
        field: 'dec',
        headerName: 'DEC',
        numeric: false,
        disablePadding: true,
        editable: false,
        width: 140, 
        valueGetter: (params) => params.row.fields.dec,
    },
    {
        field: 'web',
        headerName: 'More Info',
        renderCell: (params) => {
            return <a href={`${params.row.web}`} target="_blank" rel="noreferrer">{params.row.fields.name}</a>;
        },
        numeric: false,
        disablePadding: true,
        editable: false,
        width: 160, 
    },
];