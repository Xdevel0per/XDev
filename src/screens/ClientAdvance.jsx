import React, { useEffect, useState, useRef } from 'react'
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import MenuItem from '@mui/material/MenuItem'
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import InputAdornment from '@mui/material/InputAdornment'
import { Checkbox, Overlay } from '@blueprintjs/core';
import ReactToPrint from 'react-to-print';
import logo from './../static/b2b.png'
import Refresh from '@mui/icons-material/RefreshRounded'
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete'

import DataTable, { createTheme } from 'react-data-table-component';
import { Modal, Switch } from 'antd';
import { CheckOutlined, CloseOutlined } from '@mui/icons-material';

const updatetheme = (theme) => {
    if (theme == 'dark') {
        document.documentElement.style.setProperty('--firstcolor', '#0c0c0c');
        document.documentElement.style.setProperty('--seconscolor', '#0c0c0c');
        document.documentElement.style.setProperty('--headercolor', '#23282e18'); createTheme('newtheme', {

            text: {
                primary: '#fff',
                secondary: '#eee',
            },
            background: {
                default: '#000000a8',
            },
            context: {
                background: 'rgba(0,0,0,0.9)',

                text: '#FFFFFF',
            },
            divider: {
                default: '#424242',
            },
            action: {
                button: 'rgba(0,0,0,.54)',
                hover: 'rgba(0,0,0,.08)',
                disabled: 'rgba(0,0,0,.12)',
            },
        }, 'dark');
    } else
        if (theme == 'light') {
            document.documentElement.style.setProperty('--firstcolor', '#ffffff');
            document.documentElement.style.setProperty('--seconscolor', '#c1c1c1');
            document.documentElement.style.setProperty('--headercolor', '#89898918'); createTheme('newtheme', {
                text: {
                    primary: '#000',
                    secondary: '#333',
                },
                background: {
                    default: '#ffffffa8',
                },
                context: {
                    background: 'rgba(255,255,255,0.9)',

                    text: '#FFFFFF',
                },
                divider: {
                    default: '#424242',
                },
                action: {
                    button: 'rgba(255,255,255,.54)',
                    hover: 'rgba(255,255,255,.08)',
                    disabled: 'rgba(255,255,255,.12)',
                },
            }, 'light');
        }
        else {
            alert('error in theme manager')
            localStorage.setItem('Theme', 'light')
        }
}

updatetheme(localStorage.getItem('Theme'))
function ClientAdvance() {

    const [dark_theme_en, set_dark_theme_en] = useState('light')
    const [AccesToken, setAccesToken] = useState([]);

    const types = [
        {
            value: 'seller',
            label: 'مورد',
        },
        {
            value: 'buyer',
            label: 'عميل',
        },
        {
            value: 'both',
            label: 'عميل و مورد',
        },
    ];
    const mesures = [
        {
            value: 'unit',
            label: 'Units',
        },
        {
            value: 'kg',
            label: 'Kg',
        },
        {
            value: 'M',
            label: 'Meter',
        },
        {
            value: 'm2',
            label: 'Meter Square',
        },
    ];
    const columns = [
        {
            name: 'id',
            selector: row => row.id,
            sortable: true,
            width: '60px'
        },
        // {
        //     name: 'فاتوره',
        //     selector: row => row.refid,
        //     sortable: true,
        //     width: '100px'
        // },
        {
            name: 'فاتوره',
            selector: row => row.refid,
            sortable: true,
        },
        {
            name: 'الاسم',
            selector: row => row.vaultName,
            sortable: true,
            grow: 2,
        },
        {
            name: 'العميل',
            selector: row => row.OperatorName,
            sortable: true,
            grow: 3,
        },
        {
            name: 'وارد',
            selector: row => row.Income,
            sortable: true,
        },
        {
            name: 'منصرف',
            selector: row => row.Outcome,
            sortable: true,
        },
        {
            name: 'مرتجع',
            selector: row => row.Return,
            sortable: true,
        },
        {
            name: 'اجمالي الكميه',
            selector: row => row.Totalamount,
            sortable: true,
        },
        {
            name: 'اجمالي المبلغ',
            selector: row => row.TotalPrice == '-' ? '-' : Number(row.TotalPrice).toFixed(2).toString().split('.')[1] == '00' ? Number(row.TotalPrice).toFixed(0) : Number(row.TotalPrice).toFixed(2),
            sortable: true,
        },
        {
            name: 'تحويلات',
            selector: row => Number(row.Money) == '-' ? '-' : Number(row.Money).toFixed(2).toString().split('.')[1] == '00' ? Number(row.Money) : Number(row.Money).toFixed(2),
            sortable: true,
        },
        {
            name: 'مستحقات',
            selector: row => Number(row.Bonus) == '-' ? '-' : Number(row.Bonus).toFixed(2).toString().split('.')[1] == '00' ? Number(row.Bonus) : Number(row.Bonus).toFixed(2),
            sortable: true,
        },
        {
            name: 'العمليه',
            selector: row => row.Notes,
            sortable: true,
            grow: 3,
        },
        {
            name: 'الرصيد',
            selector: row => row.Balance,
            sortable: true,
            grow: 3,
        },
        {
            name: 'تاريخ العمليه',
            selector: row => row.Date,
            sortable: true,
        }
    ];





    const [firstvaultname, setfirstvaultname] = useState('')
    const [secondvaultname, setsecondvaultname] = useState('')
    const [theirdvaultname, settheirdvaultname] = useState('')
    const [firstvaultdata, setfirstvaultdata] = useState([])
    const [secondvaultdata, setsecondvaultdata] = useState([])
    const [theirdvaultdata, settheirdvaultdata] = useState([])
    const [sel, setsel] = useState('unit')
    const [name, setname] = useState('')
    const [expenses, setexpenses] = useState(0)
    const [payments, setpayments] = useState(0)
    const [code, setcode] = useState()
    const [selid, setselid] = useState()
    const [loadrn, setloadrn] = useState(false)
    const [loadrn3, setloadrn3] = useState(false)
    const [newsel, setnewsel] = useState('seller')
    const [newname, setnewname] = useState('')
    const [newprodname, setnewprodname] = useState('')
    const [newexpenses, setnewexpenses] = useState('0')
    const [newcamount, setnewcamount] = useState(0)
    const [newpayments, setnewpayments] = useState('0')
    const [newcode, setnewcode] = useState()
    const [newselid, setnewselid] = useState()
    const [newloadrn, setnewloadrn] = useState(false)
    const [searchload, setsearchload] = useState(false)
    const [searchtext, setsearchtext] = useState('')
    const [rows, setrows] = useState([]);
    const [rows2, setrows2] = useState([]);
    const [editrn, seteditrn] = useState(false)
    const [editrn2, seteditrn2] = useState(false)
    const search1 = (text) => {
        axios.post('http://localhost:1024/searchclients', { searchtext: text }).then((resp) => {
            if (resp.data.status == 200) {
                setsecondvaultdata(resp.data.foundproduts)
            }
        }).catch((e) => {
            alert(e.message)
        })
    }
    const search = (text) => {
        axios.post('http://localhost:1024/searchclients', { searchtext: text }).then((resp) => {
            if (resp.data.status == 200) {
                settheirdvaultdata(resp.data.foundproduts)
            }
        })
    }
    const getcode = () => {
        axios.get('http://localhost:1024/vault').then((resp) => {
            setnewcode(resp.data.vault.length + 1);
        })
    }
    const search2 = (text) => {
        axios.post('http://localhost:1024/searchvault', { searchtext: text }).then((resp) => {
            if (resp.data.status == 200) {
                setsecondvaultdata(resp.data.foundproduts)
            }
        })
    }
    const [newprice, setnewprice] = useState('0')
    const [newamount, setnewamount] = useState('0')

    const createnew = () => {
        if (!name) {
            alert('name cannot be empty')
            return
        }
        if (newcode === '') {
            alert('please enter a code')
            return
        }
        setloadrn(true)
        axios.post('http://localhost:1024/addvault', { value: payments, name: name, code: newcode }).then((resp) => {
            if (resp.data.status == 200) {
                console.log(resp.data)
                setloadrn(false)
                seteditrn(false)
                seteditrn2(false)
                setfirstvaultname(resp.data.newclient.name)
                setnewcode(newcode + 1)
            } else {
                setloadrn(false)
                alert('failed')
            }
        })
    }
    const [data, setdata] = useState('')

    const componentRef = useRef();

    const editlot = () => {
        if (!newdata) {
            alert('data cannot be empty')
            return
        }
        if (newexpenses === '') {
            alert('please enter an amount')
            return
        }
        if (newpayments === '') {
            alert('please enter a price')
            return
        }
        console.log(newdata)
        axios.post('http://localhost:1024/editlot', { lotid: newdata.id, newprice: newpayments, newamount: newexpenses }).then((resp) => {
            if (resp.data.status == 200) {
                console.log(resp.data)
                setloadrn3(false)
                seteditrn(false)
            } else {
                setloadrn(false)
                alert('failed')
            }
        })
    }
    const searchprod = () => {
        setloadrn(true);
        axios.post('http://localhost:1024/searchproducthistoryexact', { searchtext: secondvaultname }).then((resp) => {
            if (resp.data.status == 200) {
                setrows(resp.data.foundproduts)
                var sum = 0
                var asum = 0
                resp.data.foundproduts.forEach(function (value, index, arry) {
                    sum += value.totalprice;
                });
                resp.data.foundproduts.forEach(function (value, index, arry) {
                    asum += value.amount;
                });
                settotalamount(asum)
                settotalprice(sum)
            }
        })
    }
    const searchrefid = () => {
        setloadrn(true);
        axios.post('http://localhost:1024/searchlotsbyrefid', { refid }).then((resp) => {
            if (resp.data.status == 200) {
                setrows(resp.data.foundproduts)
                var sum = 0
                var asum = 0
                resp.data.foundproduts.forEach(function (value, index, arry) {
                    sum += value.totalprice;
                });
                resp.data.foundproduts.forEach(function (value, index, arry) {
                    asum += value.amount;
                });
                settotalamount(asum)
                settotalprice(sum)
            }
        })
    }
    const searchvault = () => {
        setloadrn(true);
        axios.post('http://localhost:1024/clientadvance', { clientname: secondvaultname , check}).then((resp) => {
            if (resp.data.Status == 200) {
                setrows(resp.data.summeryarray)
                setrows2(resp.data.sumarray)
                console.log(resp.data)
                // setvaultname(resp.data.summeryarray[0].vaultname)
                // setamount(resp.data.summeryarray[resp.data.summeryarray.length - 1].value)
                setloadrn(false);
            }
        })
    }
    const [amount, setamount] = useState('')
    const [vaultname, setvaultname] = useState('')

    const [prt, setprt] = useState(false)





    const [totalprice, settotalprice] = useState(0)
    const [totalamount, settotalamount] = useState(0)

    const [selectableRows, setselectedRows] = useState()

    const contextActions = () => (
        <>
            <Button color='success' style={{ marginRight: 20 }} variant='contained' onClick={() => {
                axios.post('http://localhost:1024/print/ClientAdvance', { vaultname: rows[0].vaultName }).then((resp) => {
                    setTimeout(() => {
                        window.open('http://localhost:1024/' + resp.data.file, '_blank', 'noreferrer')
                    }, 500);
                })
            }}>print</Button>
        </>
    );
    const [refid, setrefid] = useState()
    const actions = () => (
        <>
        </>
    );


    const [refreshloading, setrefreshloading] = useState(false)



    const [newdata, setnewdata] = useState({})

    const [modalview, setmodalview] = useState(false);

    const [check, setcheck] = useState(false)

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
            <Modal open={modalview} centered>
                <div style={{ width: '100%', padding: 10, display: 'flex', justifyContent: 'space-between', flexDirection: 'row' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
                            <span style={{ marginRight: 8 }}>عرض اضافه مخزن</span>
                            <Switch
                                title='عرض اضافه مخزن'
                                checkedChildren={<CheckOutlined />}
                                unCheckedChildren={<CloseOutlined />}
                                defaultChecked
                            />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
                            <span style={{ marginRight: 8 }}>عرض الاصناف المنصرفه</span>
                            <Switch
                                title='عرض الاصناف المنصرفه'
                                checkedChildren={<CheckOutlined />}
                                unCheckedChildren={<CloseOutlined />}
                                defaultChecked
                            />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
                            <span style={{ marginRight: 8 }}>عرض المستحقات</span>
                            <Switch
                                title='عرض المستحقات'
                                checkedChildren={<CheckOutlined />}
                                unCheckedChildren={<CloseOutlined />}
                                defaultChecked
                            />
                        </div>
                    </div>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
                            <Switch
                                title='حساب اضافه مخزن'
                                checkedChildren={<CheckOutlined />}
                                unCheckedChildren={<CloseOutlined />}
                                defaultChecked
                            />
                            <span style={{ marginLeft: 8 }}>
                                حساب اضافه مخزن
                            </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
                            <Switch
                                title='حساب الاصناف المنصرفه'
                                checkedChildren={<CheckOutlined />}
                                unCheckedChildren={<CloseOutlined />}
                                defaultChecked
                            />
                            <span style={{ marginLeft: 8 }}>
                                حساب الاصناف المنصرفه
                            </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
                            <Switch
                                title='حساب المستحقات'
                                checkedChildren={<CheckOutlined />}
                                unCheckedChildren={<CloseOutlined />}
                                defaultChecked
                            />
                            <span style={{ marginLeft: 8 }}>
                                حساب المستحقات
                            </span>
                        </div>
                    </div>

                </div>

            </Modal >
            <div style={{ flexDirection: 'row-reverse', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ width: '100%', alignItems: 'center', display: 'flex', justifyContent: 'end', flexDirection: 'row'}}>
                    <Checkbox label='أوزان؟' checked={check} onClick={() => { setcheck(!check) }} />
                    <Autocomplete
                        id="free-solo-demo"
                        label='d'
                        style={{ margin: 10, width: 200 }}

                        freeSolo
                        value={secondvaultname}

                        onInputChange={(event, newInputValue) => {
                            setsecondvaultname(newInputValue);
                            search1(newInputValue)

                        }}
                        onFocus={() => {
                            axios.get('http://localhost:1024/clients').then((resp) => {
                                if (resp.data.status == 200) {
                                    setsecondvaultdata(resp.data.clients)
                                }
                            })
                        }}
                        options={secondvaultdata.map((option) => option.name)}
                        size='small'

                        renderInput={(params) => <TextField {...params} label="عميل" />}
                        onDoubleClick={() => { seteditrn2(true); getcode() }}
                    />
                    <Button style={{ margin: 10 }}
                        // disabled={loadrn}
                        variant='contained' onClick={() => { searchvault() }}>تأكيد</Button>
                </div>
                <div>
                    <Button color='success' style={{ margin: 10 }} variant='contained' onClick={() => {
                        axios.post('http://localhost:1024/print/clientadvance', { rows, rows2 }).then((resp) => {
                            setTimeout(() => {
                                window.open('http://localhost:1024/' + resp.data.file, '_blank', 'noreferrer')
                            }, 500);
                        })
                    }}>print</Button>
                </div>
            </div>
            <div style={{ width: '100%' }}>
                <DataTable
                    dense
                    theme='newtheme'
                    highlightOnHover
                    pagination
                    paginationPerPage={100}
                    pointerOnHover
                    fixedHeader
                    fixedHeaderScrollHeight='450px'
                    selectableRowsHighlight
                    direction="rtl"
                    onSelectedRowsChange={(rows) => {
                        setselectedRows(rows.selectedRows);
                        setdata(rows);
                        console.log(rows.selectedRows)
                        var sum = 0
                        var asum = 0
                        rows.selectedRows.forEach(function (value, index, arry) {
                            sum += value.totalprice;
                        });
                        rows.selectedRows.forEach(function (value, index, arry) {
                            asum += value.amount;
                        });
                        settotalamount(asum)
                        settotalprice(sum)
                    }}
                    selectableRowsComponent={Checkbox}
                    columns={columns}
                    onRowDoubleClicked={(e) => { console.log({ e }) }}
                    // selectableRows
                    data={rows}

                />
                <DataTable
                    dense
                    theme='newtheme'
                    highlightOnHover
                    pagination
                    paginationPerPage={100}
                    pointerOnHover
                    fixedHeader
                    fixedHeaderScrollHeight='450px'
                    selectableRowsHighlight
                    direction="rtl"
                    selectableRowsComponent={Checkbox}
                    columns={[
                        {
                            name: 'id',
                            selector: row => row.id,
                            sortable: true,
                            width: '60px'
                        },
                        {
                            name: 'العمليه',
                            selector: row => row.product,
                            sortable: true,
                            grow: 2,
                        },
                        {
                            name: 'العمليه',
                            selector: row => row.border ? 'y' : 'n',
                            sortable: true,
                            grow: 2,
                        },
                        {
                            name: 'منصرف',
                            selector: row => row.vmoney,
                            sortable: true,
                        },
                        {
                            name: 'وارد',
                            selector: row => row.cmoney,
                            sortable: true,
                        },
                        {
                            name: 'مستحقات له',
                            selector: row => row.clientm,
                            sortable: true,
                        },
                        {
                            name: 'مستحقات عليه',
                            selector: row => row.vaultm,
                            sortable: true,
                        },
                        {
                            name: 'اجمالي ما له',
                            selector: row => row.totalc,
                            sortable: true,
                        },
                        {
                            name: 'اجمالي ما عليه',
                            selector: row => row.totalv,
                            sortable: true,
                        },
                        {
                            name: 'الرصيد',
                            selector: row => !isNaN(row.balance) ? Number(row.balance).toFixed(2) : row.balance,
                            sortable: true,
                        },
                    ]}
                    onRowDoubleClicked={(e) => { console.log({ e }) }}
                    // selectableRows
                    data={rows2}

                />
                {/* <div style={{ display: 'flex', width: '100%', justifyContent: 'start', alignItems: 'center' }}>
                    <Typography color={'#fff'} style={{ marginLeft: 50 }}>
                        اسم الخزينه : {vaultname}
                    </Typography>
                    <Typography color={'#fff'} style={{ marginLeft: 50 }}>
                        رصيد الخزينه الحالي : {amount}
                    </Typography>
                </div> */}
            </div>
            <Dialog open={editrn} onClose={() => { seteditrn(false) }}>
                <DialogTitle>تعديل فاتوره صنف</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        size='small'
                        fullWidth
                        label="اسم الصنف"
                        type="text"
                        value={newdata.to}
                        variant="outlined"
                        disabled
                    />
                    <TextField
                        autoFocus
                        fullWidth
                        margin="dense"
                        size='small'
                        id="expenses"
                        label="الكميه"
                        type="number"
                        value={newexpenses}
                        onChange={(e) => { setnewexpenses(e.currentTarget.value) }}
                        variant="outlined"
                    />
                    <TextField
                        autoFocus
                        fullWidth
                        margin="dense"
                        size='small'
                        id="expenses"
                        label="السعر"
                        type="number"
                        value={newpayments}
                        onChange={(e) => { setnewpayments(e.currentTarget.value) }}
                        variant="outlined"
                    />
                    <TextField
                        autoFocus
                        fullWidth
                        margin="dense"
                        size='small'
                        id="expenses"
                        label="total"
                        type="number"
                        disabled
                        value={newpayments * newexpenses}
                        variant="outlined"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { seteditrn(false) }} >الغاء</Button>
                    <Button disabled={loadrn3} variant='contained' onClick={() => { editlot() }}>حفظ</Button>
                </DialogActions>
            </Dialog>
        </div >
    )
}

export default ClientAdvance