import React, { useContext, useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import Paper from '@mui/material/Paper';
import { IconButton, Tooltip, Typography, Toolbar, Box, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Checkbox, TableSortLabel } from '@mui/material/';
import { alpha } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { visuallyHidden } from '@mui/utils'
import FilterListIcon from '@mui/icons-material/FilterList'
import Spinner from '../Loading/Spinner';

import { AstroContext } from '../context/AstroContext'; 
import { UserContext } from '../context/UserContext';
import { useAuth0 } from '@auth0/auth0-react';

const columns = [
    { 
        id: 'name',
        label: 'Catalog Name',
        numeric: false,
        disablePadding: true,
        minWidth: 100 
    },
    { 
        id: 'common_names', 
        label: 'Common Names',
        numeric: false, 
        disablePadding: true,
        minWidth: 200 
    },
    {
        id: 'v_mag',
        label: 'Apparent Magnitude',
        numeric: true,
        disablePadding: false,
        minWidth: 70,
    },
    {
        id: 'object_definition',
        label: 'Object Type',
        numeric: false,
        disablePadding: true,
        minWidth: 100,
    },
    {
        id: 'ra',
        label: 'Right Ascension',
        numeric: false,
        disablePadding: true,
        minWidth: 170,
    },
    {
        id: 'dec',
        label: 'Declination',
        numeric: false,
        disablePadding: true,
        minWidth: 170,
    },
  ];
  
  
const Catalog = () => {
    const { user, isAuthenticated, isLoading } = useAuth0
    const {astroCatalog, setAstroCatalog} = useContext(AstroContext);
    const { state, setLoadingState, unsetLoadingState, setLocation } = useContext(UserContext);
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    let {lat, lon} = state.location;
    let navigate = useNavigate();

    const session = JSON.parse(localStorage.getItem('session'))

    useEffect( () => {
    if (!state.locationsession && session) {    
        setLocation(session.location);
        lat = session.location.lat;
        lon = session.location.lat;
    }
    }, []); // eslint-disable-line

    
    useEffect( () => {
        
        
        if (!state.hasLoaded && !lat ) {
            
            window.alert("Please select a location first");
            navigate('/location')
            
        } else {
            setLoadingState()

            fetch(`/astro/?lat=${lat}&lon=${lon}`, {
                headers : { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
            .then((res) => res.json())
            .then((data) => {
                if (data.status !== 200) {
                console.log(data);
                } else {
                setAstroCatalog(data.data);
                unsetLoadingState();
                }
            })
        }
        
    }, []); // eslint-disable-line


    const descendingComparator = (a, b, orderBy) => {
        if (b[orderBy] < a[orderBy]) {
        return -1;
        }
        if (b[orderBy] > a[orderBy]) {
        return 1;
        }
        return 0;
    }
    
    const getComparator = (order, orderBy) => {
        return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
    }
    
    // This method is created for cross-browser compatibility, if you don't
    // need to support IE11, you can use Array.prototype.sort() directly
    const stableSort = (array, comparator) => {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    }
    
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
        
    const EnhancedTableHead = ({ order, orderBy, onRequestSort }) => {
        const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
        };
    
        return (
        <TableHead>
            <TableRow>
            <TableCell padding="checkbox">
            </TableCell>
            {columns.map((column) => (
                <TableCell
                key={column.id}
                align={'left'}
                // style={{ minWidth: column.minWidth }}
                padding={column.disablePadding ? 'none' : 'normal'}
                sortDirection={orderBy === column.id ? order : false}
                >
                <TableSortLabel
                    active={orderBy === column.id}
                    direction={orderBy === column.id ? order : 'asc'}
                    onClick={createSortHandler(column.id)}
                >
                    {column.label}
                    {orderBy === column.id ? (
                    <Box component="span" sx={visuallyHidden}>
                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </Box>
                    ) : null}
                </TableSortLabel>
                </TableCell>
            ))}
            </TableRow>
        </TableHead>
        );
    }
    
    EnhancedTableHead.propTypes = {
        numSelected: PropTypes.number.isRequired,
        onRequestSort: PropTypes.func.isRequired,
        onSelectAllClick: PropTypes.func.isRequired,
        order: PropTypes.oneOf(['asc', 'desc']).isRequired,
        orderBy: PropTypes.string.isRequired,
        rowCount: PropTypes.number.isRequired,
    };
    
    const EnhancedTableToolbar = ({ numSelected }) => {
    
        return (
        <Toolbar
            sx={{
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            ...(numSelected > 0 && {
                bgcolor: (theme) =>
                alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
            }),
            }}
        >
            {numSelected > 0 ? (
            <Typography
                sx={{ flex: '1 1 100%' }}
                color="inherit"
                variant="subtitle1"
                component="div"
            >
                {numSelected} selected
            </Typography>
            ) : (
            <Typography
                sx={{ flex: '1 1 100%' }}
                variant="h6"
                id="tableTitle"
                component="div"
            >
                Astronomical objects observable for the selected period
            </Typography>
            )}
    
            <Tooltip title="Filter list">
                <IconButton>
                <FilterListIcon />
                </IconButton>
            </Tooltip>
        </Toolbar>
        );
    };
    
    EnhancedTableToolbar.propTypes = {
        numSelected: PropTypes.number.isRequired,
    };
    
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
        };
        
    
        // const handleSelectAllClick = (event) => {
        // if (event.target.checked) {
        //     const newSelecteds = rows.map((n) => n.name);
        //     setSelected(newSelecteds);
        //     return;
        // }
        // setSelected([]);
        // };
    
        const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];
    
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
            selected.slice(0, selectedIndex),
            selected.slice(selectedIndex + 1),
            );
        }
    
        setSelected(newSelected);
        };
    
    
        const isSelected = (name) => selected.indexOf(name) !== -1;
    
        // Avoid a layout jump when reaching the last page with empty rows.
        const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - astroCatalog.length) : 0;
    

    
    if (!state.hasLoaded){
        return (
            <Spinner />
        )
    } else {    
        return (
        <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
            <EnhancedTableToolbar numSelected={selected.length} />
            
            <TableContainer>
                <Table stickyHeader
                sx={{ maxHeight: 400 }}
                size={'small'}
                >
                <EnhancedTableHead stickyHeader
                    numSelected={selected.length}
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                    rowCount={astroCatalog.length}
                />
                <TableBody>
                    {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                    rows.slice().sort(getComparator(order, orderBy)) */}
                    {stableSort(astroCatalog, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((object, index) => {
                        const isItemSelected = isSelected(object._id);
                        const labelId = `enhanced-table-checkbox-${index}`;
    
                        return (
                        <TableRow
                            hover
                            onClick={(event) => handleClick(event, object._id)}
                            role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={object._id}
                            selected={isItemSelected}
                        >
                            <TableCell padding="checkbox">
                            <Checkbox
                                color="primary"
                                checked={isItemSelected}
                                inputProps={{
                                'aria-labelledby': labelId,
                                }}
                            />
                            </TableCell>
                            <TableCell
                            component="th"
                            id={labelId}
                            scope="row"
                            padding="none"
                            >
                            {object.fields.name}
                            </TableCell>
                            <TableCell align="right">{object.fields.common_names}</TableCell>
                            <TableCell align="right">{object.fields.v_mag}</TableCell>
                            <TableCell align="right">{object.fields.object_definition}</TableCell>
                            <TableCell align="right">{object.fields.ra}</TableCell>
                            <TableCell align="right">{object.fields.dec}</TableCell>
                        </TableRow>
                        );
                    })}
                    {emptyRows > 0 && (
                    <TableRow
                        style={{
                        height: (33) * emptyRows,
                        }}
                    >
                        <TableCell colSpan={6} />
                    </TableRow>
                    )}
                </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[25, 50, 100]}
                component="div"
                count={astroCatalog.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
            </Paper>
        </Box>
        )
    }
}



export default Catalog;