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
import Modal from '@mui/material/Modal'
import ReactToPrint from 'react-to-print';
import logo from './../static/b2b.png'
import Refresh from '@mui/icons-material/RefreshRounded'
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete'

import DataTable, { createTheme } from 'react-data-table-component';
createTheme('solarized', {
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
const updatetheme = (theme) => {
    if (theme == 'dark') {
        document.documentElement.style.setProperty('--firstcolor', '#000000');
        document.documentElement.style.setProperty('--seconscolor', '#1f1f1f');
        document.documentElement.style.setProperty('--headercolor', '#00000018'); createTheme('newtheme', {

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
            localStorage.setItem('Theme','light')
        }
}

updatetheme(localStorage.getItem('Theme'))
function Summery() {

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
            name: 'العميل',
            selector: row => row.clientname,
            sortable: true,
            grow: 2,
        },
        {
            name: 'الصنف',
            selector: row => row.productname,
            sortable: true,
            grow: 3,
        },
        {
            name: 'الكميه',
            selector: row => row.amount,
            sortable: true,
        },
        {
            name: 'المرتجع',
            selector: row => row.return,
            sortable: true,
        },
        {
            name: 'اجمالي الكميه',
            selector: row => row.amount - row.return,
            sortable: true,
        },

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
    const [rows3, setrows3] = useState([]);
    const [rows4, setrows4] = useState([]);
    const [editrn, seteditrn] = useState(false)
    const [editrn2, seteditrn2] = useState(false)
    const search1 = (text) => {
        axios.post('http://192.168.1.20:1024/searchclients', { searchtext: text }).then((resp) => {
            if (resp.data.status == 200) {
                setfirstvaultdata(resp.data.foundproduts)
            }
        })
    }
    const search = (text) => {
        axios.post('http://192.168.1.20:1024/searchclients', { searchtext: text }).then((resp) => {
            if (resp.data.status == 200) {
                settheirdvaultdata(resp.data.foundproduts)
            }
        })
    }
    const getcode = () => {
        axios.get('http://192.168.1.20:1024/Vault').then((resp) => {
            setnewcode(resp.data.Vault.length + 1);
        })
    }
    const search2 = (text) => {
        axios.post('http://192.168.1.20:1024/searchproduct', { searchtext: text }).then((resp) => {
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
        axios.post('http://192.168.1.20:1024/addVault', { value: payments, name: name, code: newcode }).then((resp) => {
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

    const createnewexport = () => {
        if (!data) {
            alert('data cannot be empty')
            return
        }
        if (theirdvaultname === '') {
            alert('please select a client')
            return
        }
        if (newexpenses === '') {
            alert('please enter an amount')
            return
        }
        console.log(newdata)
        axios.post('http://192.168.1.20:1024/addProductoutcome', { prodname: newdata.to, clientname: theirdvaultname, prodid: newdata.toid, amount: newexpenses, pricehistoryid: newdata.id }).then((resp) => {
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
    const [selectedRows, setselectedRows] = useState([])
    const searchprod = () => {
        setloadrn(true);
        axios.post('http://192.168.1.20:1024/searchproducthistoryexact', { searchtext: secondvaultname }).then((resp) => {
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

    var arr = []
    var stop = { "id": "Stop" }
    var hed = { "id": "hed" }
    var header = { id: 'مم', refid: 'فاتوره', productid: 4, clientid: 26, productname: 'الصنف', clientname: "اسم العميل", amount: 'الكميه', return: "المرتجع" }
    var headernoreturn = { id: 'م', refid: 'فاتوره', productid: 4, clientid: 26, productname: 'الصنف', clientname: "اسم العميل", amount: 'الكميه', return: "المرتجع" }
    const searchclient = () => {
        setloadrn(true);
        axios.post('http://192.168.1.20:1024/clientsummery', { clientname: firstvaultname }).then((resp) => {
            if (resp.data.status == 200) {
                arr = []
                arr = [...arr, stop, hed, ...resp.data.exportsum]
                arr = [...arr, stop, hed, ...resp.data.importsum]
                arr = [...arr, stop, hed, ...resp.data.retsum]
                arr = [...arr, stop, hed, ...resp.data.diff]
                console.log(arr)
                setsumarr(arr)
                setrows(resp.data.exportsum)
                var sum = 0
                var asum = 0
                resp.data.exportsum.forEach(function (value, index, arry) {
                    sum += value.totalprice;
                });
                resp.data.exportsum.forEach(function (value, index, arry) {
                    asum += value.amount;
                });
                settotalamount(asum)
                settotalprice(sum)

                setrows2(resp.data.importsum)
                var sum = 0
                var asum = 0
                resp.data.importsum.forEach(function (value, index, arry) {
                    sum += value.totalprice;
                });
                resp.data.importsum.forEach(function (value, index, arry) {
                    asum += value.amount;
                });
                settotalamount2(asum)
                settotalprice2(sum)


                setrows3(resp.data.diff)
                var sum = 0
                var asum = 0
                resp.data.diff.forEach(function (value, index, arry) {
                    sum += value.totalprice;
                });
                resp.data.diff.forEach(function (value, index, arry) {
                    asum += value.amount;
                });
                settotalamount3(asum)
                settotalprice3(sum)



                setrows4(resp.data.retsum)
                var sum = 0
                var asum = 0
                resp.data.diff.forEach(function (value, index, arry) {
                    sum += value.totalprice;
                });
                resp.data.diff.forEach(function (value, index, arry) {
                    asum += value.amount;
                });
                settotalamount4(asum)
                settotalprice4(sum)
            }
        })
    }
    const [prt, setprt] = useState(false)





    const [totalprice, settotalprice] = useState(0)
    const [totalamount, settotalamount] = useState(0)
    const [totalprice2, settotalprice2] = useState(0)
    const [totalprice3, settotalprice3] = useState(0)
    const [totalprice4, settotalprice4] = useState(0)
    const [totalamount2, settotalamount2] = useState(0)
    const [totalamount3, settotalamount3] = useState(0)
    const [totalamount4, settotalamount4] = useState(0)



    const [refreshloading, setrefreshloading] = useState(false)

    const [sumarr, setsumarr] = useState([])

    const [newdata, setnewdata] = useState({})


    const [dark_theme_en, set_dark_theme_en] = useState('light')
    const [AccesToken, setAccesToken] = useState([]);


    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
            <Modal open={prt} onClose={() => { setprt(false) }}>
                <div style={{ width: '100%', height: '100%', backgroundColor: '#fff', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: 50, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                        <div style={{ width: '50%' }}>
                            <img onClick={(e) => {
                                e.preventDefault();
                                window.location.href = 'http://localhost:3000/';
                            }} src={logo} width={200} height={122} style={{ marginLeft: 5 }} />
                        </div>
                        <div style={{ width: '50%', alignItems: 'center', display: 'flex', justifyContent: 'end' }}>
                            <Typography variant='h2' style={{}}>client summery</Typography>
                        </div>
                    </div>
                    <div style={{ padding: 50 }}>
                        <Typography variant='h4'>
                            Client Name : {firstvaultname}
                        </Typography>
                        <Typography variant='h4'>
                            Invoice Date : {new Date().toLocaleDateString()}
                        </Typography>
                    </div>
                    <div style={{ padding: 20, width: '100%' }}>

                        <div style={{ display: 'flex', width: '100%', backgroundColor: '#666' }}>
                            <div class="view w-48 p-4-8" style={{ padding: 4, width: '10%' }}>
                                <Typography variant='h5' color={'#fff'}>
                                    N.o
                                </Typography>
                            </div>
                            <div class="view w-48 p-4-8" style={{ padding: 4, width: '48%' }}>
                                <Typography variant='h5' color={'#fff'}>
                                    Product Name
                                </Typography>
                            </div>
                            <div class="view w-48 p-4-8" style={{ padding: 4, width: '17%' }}>
                                <Typography variant='h5' color={'#fff'}>
                                    Qty
                                </Typography>
                            </div>
                            <div class="view w-48 p-4-8" style={{ padding: 4, width: '17%' }}>
                                <Typography variant='h5' color={'#fff'}>
                                    Price
                                </Typography>
                            </div>
                            <div class="view w-48 p-4-8" style={{ padding: 4, width: '18%' }}>
                                <Typography variant='h5' color={'#fff'}>
                                    Total Price
                                </Typography>
                            </div>
                        </div>
                        {rows.map((index, i) => {
                            return (
                                <div style={{ display: 'flex', width: '100%', backgroundColor: '#eee', pageBreakAfter: 'always' }}>
                                    <div class="view w-48 p-4-8" style={{ padding: 4, width: '10%' }}>
                                        <Typography variant='h5' color={'#000'}>
                                            {i + 1}
                                        </Typography>
                                    </div>
                                    <div class="view w-48 p-4-8" style={{ padding: 4, width: '48%' }}>
                                        <Typography variant='h5' color={'#000'}>
                                            {index.productname}
                                        </Typography>
                                    </div>
                                    <div class="view w-48 p-4-8" style={{ padding: 4, width: '17%' }}>
                                        <Typography variant='h5' color={'#000'}>
                                            {index.amount}
                                        </Typography>
                                    </div>
                                    <div class="view w-48 p-4-8" style={{ padding: 4, width: '17%' }}>
                                        <Typography variant='h5' color={'#000'}>
                                            {index.price}
                                        </Typography>
                                    </div>
                                    <div class="view w-48 p-4-8" style={{ padding: 4, width: '18%' }}>
                                        <Typography variant='h5' color={'#000'}>
                                            {index.totalprice}
                                        </Typography>
                                    </div>
                                </div>
                            )
                        })}
                    </div>




                    <div style={{ padding: 20, width: '100%' }}>

                        <div style={{ display: 'flex', width: '100%', backgroundColor: '#666' }}>
                            <div class="view w-48 p-4-8" style={{ padding: 4, width: '10%' }}>
                                <Typography variant='h5' color={'#fff'}>
                                    N.o
                                </Typography>
                            </div>
                            <div class="view w-48 p-4-8" style={{ padding: 4, width: '48%' }}>
                                <Typography variant='h5' color={'#fff'}>
                                    Product Name
                                </Typography>
                            </div>
                            <div class="view w-48 p-4-8" style={{ padding: 4, width: '17%' }}>
                                <Typography variant='h5' color={'#fff'}>
                                    Qty
                                </Typography>
                            </div>
                            <div class="view w-48 p-4-8" style={{ padding: 4, width: '17%' }}>
                                <Typography variant='h5' color={'#fff'}>
                                    Price
                                </Typography>
                            </div>
                            <div class="view w-48 p-4-8" style={{ padding: 4, width: '18%' }}>
                                <Typography variant='h5' color={'#fff'}>
                                    Date
                                </Typography>
                            </div>
                        </div>
                        {rows2.map((index, i) => {
                            return (
                                <div style={{ display: 'flex', width: '100%', backgroundColor: '#eee' }}>
                                    <div class="view w-48 p-4-8" style={{ padding: 4, width: '10%' }}>
                                        <Typography variant='h5' color={'#000'}>
                                            {i + 1}
                                        </Typography>
                                    </div>
                                    <div class="view w-48 p-4-8" style={{ padding: 4, width: '48%' }}>
                                        <Typography variant='h5' color={'#000'}>
                                            {index.productname}
                                        </Typography>
                                    </div>
                                    <div class="view w-48 p-4-8" style={{ padding: 4, width: '17%' }}>
                                        <Typography variant='h5' color={'#000'}>
                                            {index.amount}
                                        </Typography>
                                    </div>
                                    <div class="view w-48 p-4-8" style={{ padding: 4, width: '17%' }}>
                                        <Typography variant='h5' color={'#000'}>
                                            {index.price}
                                        </Typography>
                                    </div>
                                    <div class="view w-48 p-4-8" style={{ padding: 4, width: '18%' }}>
                                        <Typography variant='h5' color={'#000'}>
                                            {index.time.split('T')[0]}
                                        </Typography>
                                    </div>
                                </div>
                            )
                        })}
                    </div>




                    <div style={{ padding: 20, width: '100%' }}>

                        <div style={{ display: 'flex', width: '100%', backgroundColor: '#666' }}>
                            <div class="view w-48 p-4-8" style={{ padding: 4, width: '10%' }}>
                                <Typography variant='h5' color={'#fff'}>
                                    N.o
                                </Typography>
                            </div>
                            <div class="view w-48 p-4-8" style={{ padding: 4, width: '48%' }}>
                                <Typography variant='h5' color={'#fff'}>
                                    Product Name
                                </Typography>
                            </div>
                            <div class="view w-48 p-4-8" style={{ padding: 4, width: '17%' }}>
                                <Typography variant='h5' color={'#fff'}>
                                    Qty
                                </Typography>
                            </div>
                            <div class="view w-48 p-4-8" style={{ padding: 4, width: '17%' }}>
                                <Typography variant='h5' color={'#fff'}>
                                    Price
                                </Typography>
                            </div>
                            <div class="view w-48 p-4-8" style={{ padding: 4, width: '18%' }}>
                                <Typography variant='h5' color={'#fff'}>
                                    Date
                                </Typography>
                            </div>
                        </div>
                        {rows3.map((index, i) => {
                            return (
                                <div style={{ display: 'flex', width: '100%', backgroundColor: '#eee' }}>
                                    <div class="view w-48 p-4-8" style={{ padding: 4, width: '10%' }}>
                                        <Typography variant='h5' color={'#000'}>
                                            {i + 1}
                                        </Typography>
                                    </div>
                                    <div class="view w-48 p-4-8" style={{ padding: 4, width: '48%' }}>
                                        <Typography variant='h5' color={'#000'}>
                                            {index.productname}
                                        </Typography>
                                    </div>
                                    <div class="view w-48 p-4-8" style={{ padding: 4, width: '17%' }}>
                                        <Typography variant='h5' color={'#000'}>
                                            {index.amount}
                                        </Typography>
                                    </div>
                                    <div class="view w-48 p-4-8" style={{ padding: 4, width: '17%' }}>
                                        <Typography variant='h5' color={'#000'}>
                                            {index.price}
                                        </Typography>
                                    </div>
                                    <div class="view w-48 p-4-8" style={{ padding: 4, width: '18%' }}>
                                        <Typography variant='h5' color={'#000'}>
                                            {index.time.split('T')[0]}
                                        </Typography>
                                    </div>
                                </div>
                            )
                        })}
                    </div>



                </div>
            </Modal>
            <div style={{ width: '100%', alignItems: 'baseline', display: 'flex', justifyContent: 'space-between', flexDirection: 'row', marginTop: 20, marginBottom: 20, paddingLeft: 20, paddingRight: 20 }}>
                <div>
                    {/* <Button disabled={false} variant='contained' color='success' onClick={() => { setprt(true) }}>print</Button> */}
                    <Button color='success' style={{ marginRight: 20 }} variant='contained' onClick={() => {
                        axios.post('http://192.168.1.20:1024/print/clientsummery', { rows: sumarr, name: rows[0].clientname }).then((resp) => {
                            setTimeout(() => {
                                window.open('http://192.168.1.20:1024/' + resp.data.file, '_blank', 'noreferrer')
                            }, 500);
                        })
                    }}>print</Button>
                </div>
                <div style={{ alignItems: 'baseline', display: 'flex', justifyContent: 'end', flexDirection: 'row' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline' }}>
                        <Autocomplete
                            id="free-solo-demo"
                            label='d'
                            style={{ marginRight: 20, width: 200 }}
                            onFocus={() => {
                                axios.get('http://192.168.1.20:1024/clients').then((resp) => {
                                    setfirstvaultdata(resp.data.clients)
                                })
                            }}
                            freeSolo
                            value={firstvaultname}
                            onInputChange={(event, newInputValue) => {
                                setfirstvaultname(newInputValue);
                                search1(newInputValue)
                            }}
                            options={firstvaultdata.map((option) => option.name)}
                            size='small'
                            renderInput={(params) => <TextField {...params} label="عميل/مورد" />}
                        />
                        <Button style={{ marginRight: 20 }} disabled={false} variant='contained' onClick={() => { searchclient() }}>تأكيد</Button>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline' }}>
                        <Button style={{ marginLeft: 20 }} disabled={refreshloading} variant='contained' color='warning' onClick={() => {
                            setrows([])
                            setrows2([])
                            setrows3([])
                            setrows4([])
                            setfirstvaultname('')
                            setsecondvaultname('')
                        }} endIcon={<Refresh />}>Reset</Button>
                    </div>
                </div>


            </div>

            <div style={{ width: '100%' }}>
                <div style={{ height: 50, backgroundColor: '#ffffff20', backdropFilter: 'blur(20px)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <h6>مواد التعبأه المستحقه</h6>
                </div>
                <DataTable
                    pagination
                    dense
                    theme='newtheme'
                    paginationPerPage={100}
                    highlightOnHover
                    pointerOnHover
                    fixedHeader
                    fixedHeaderScrollHeight='350px'
                    direction="rtl"
                    columns={
                        [
                            {
                                name: 'العميل',
                                selector: row => row.clientname,
                                sortable: true,
                                grow: 2,
                            },
                            {
                                name: 'الصنف',
                                selector: row => row.productname,
                                sortable: true,
                                grow: 3,
                            },
                            {
                                name: 'الكميه',
                                selector: row => row.amount,
                                sortable: true,
                            }
                        ]
                    }
                    data={rows}
                />


                <div style={{ height: 50, backgroundColor: '#ffffff20', backdropFilter: 'blur(20px)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <h6>مواد التعبأه المرتجعه</h6>
                </div>
                <DataTable
                    pagination
                    dense
                    theme='newtheme'
                    paginationPerPage={100}
                    highlightOnHover
                    pointerOnHover
                    fixedHeader
                    fixedHeaderScrollHeight='350px'
                    direction="rtl"
                    columns={
                        [
                            {
                                name: 'العميل',
                                selector: row => row.clientname,
                                sortable: true,
                                grow: 2,
                            },
                            {
                                name: 'الصنف',
                                selector: row => row.productname,
                                sortable: true,
                                grow: 3,
                            },
                            {
                                name: 'الكميه',
                                selector: row => row.amount,
                                sortable: true,
                            },
                        ]
                    }
                    data={rows4}
                />



                <div style={{ height: 50, backgroundColor: '#ffffff20', backdropFilter: 'blur(20px)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <h6>المنتج النهائى</h6>
                </div>
                <DataTable
                    pagination
                    dense
                    theme='newtheme'
                    paginationPerPage={100}
                    highlightOnHover
                    pointerOnHover
                    fixedHeader
                    fixedHeaderScrollHeight='350px'
                    direction="rtl"
                    columns={
                        [
                            {
                                name: 'العميل',
                                selector: row => row.clientname,
                                sortable: true,
                                grow: 2,
                            },
                            {
                                name: 'الصنف',
                                selector: row => row.productname,
                                sortable: true,
                                grow: 3,
                            },
                            {
                                name: 'الكميه',
                                selector: row => row.amount,
                                sortable: true,
                            },
                            {
                                name: 'المرتجع',
                                selector: row => row.return,
                                sortable: true,
                            },
                            {
                                name: 'اجمالي الكميه',
                                selector: row => row.amount - row.return,
                                sortable: true,
                            },

                        ]
                    }
                    data={rows2}
                />
                <div style={{ height: 50, backgroundColor: '#ffffff20', backdropFilter: 'blur(20px)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <h6>الفرق</h6>
                </div>
                <DataTable
                    pagination
                    dense
                    theme='newtheme'
                    paginationPerPage={100}
                    highlightOnHover
                    pointerOnHover
                    fixedHeader
                    fixedHeaderScrollHeight='350px'
                    direction="rtl"
                    columns={
                        [
                            {
                                name: 'العميل',
                                selector: row => row.clientname,
                                sortable: true,
                                grow: 2,
                            },
                            {
                                name: 'الصنف',
                                selector: row => row.productname,
                                sortable: true,
                                grow: 3,
                            },
                            {
                                name: 'الكميه',
                                selector: row => row.amount,
                                sortable: true,
                            },
                        ]
                    }
                    data={rows3}
                />
            </div>
            <Dialog open={editrn} onClose={() => { seteditrn(false) }}>
                <DialogTitle>صرف صنف من المخزن</DialogTitle>
                <DialogContent>
                    <TextField
                        style={{ marginRight: 20 }}
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
                    <Autocomplete
                        id="free-solo-demo"
                        label='d'
                        style={{ marginRight: 20, width: 200 }}
                        fullWidth
                        onFocus={() => {
                            axios.get('http://192.168.1.20:1024/clients').then((resp) => {
                                settheirdvaultdata(resp.data.clients)
                            })
                        }}
                        freeSolo
                        value={theirdvaultname}
                        onInputChange={(event, newInputValue) => {
                            settheirdvaultname(newInputValue);
                            search(newInputValue)
                        }}
                        options={theirdvaultdata.map((option) => option.name)}
                        size='small'
                        renderInput={(params) => <TextField {...params} label="العميل" />}
                    />
                    <TextField
                        style={{ marginRight: 20 }}
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
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { seteditrn(false) }} >الغاء</Button>
                    <Button disabled={loadrn3} variant='contained' onClick={() => { createnewexport() }}>اضافه</Button>
                </DialogActions>
            </Dialog>
        </div >
    )
}

export default Summery