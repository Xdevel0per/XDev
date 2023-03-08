import express from 'express';
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import cors from 'cors'
const app = express();
app.use(express.json())
app.use(cors())
app.use(express.static('files'))
import fs from 'fs'
import pdfkit from 'pdfkit';
import bidiFactory from 'bidi-js'
const bidi = bidiFactory()

const fixtext = (text) => {
    const embeddingLevels = bidi.getEmbeddingLevels(text, "rtl");
    let newText = text.split("");

    const { levels, paragraphs } = embeddingLevels;

    const flips = bidi.getReorderSegments(
        text, //the full input string
        embeddingLevels //the full result object from getEmbeddingLevels
    );
    console.log(flips)
    flips.forEach((range, i) => {
        const [start, end] = range;
        // Reverse this sequence of characters from start to end, inclusive
        for (let i = 0; i <= (end - start) / 2; i++) {
            [newText[start + i], newText[end - i]] = [
                newText[end - i],
                newText[start + i]
            ];
            //...
        }
    });
    console.log(flips.length > 1)
    return flips.length > 1 ? newText.join('') : newText.reverse().join('')
}
const getflips = (text) => {
    const embeddingLevels = bidi.getEmbeddingLevels(text, "rtl");
    let newText = text.split("");

    const { levels, paragraphs } = embeddingLevels;

    const flips = bidi.getReorderSegments(
        text, //the full input string
        embeddingLevels //the full result object from getEmbeddingLevels
    );

    return flips.length
}
console.log(getflips('شركه pp ميم'))
var invoice = {
    shipping: {
        name: "John Doe",
        address: "1234 Main Street",
        city: "San Francisco",
        state: "CA",
        country: "US",
        postal_code: 94111
    },
    items: [
        {
            item: "TC 100",
            description: "Toner Cartridge",
            quantity: 2,
            amount: 6000
        },
        {
            item: "USB_EXT",
            description: "USB Cable Extender",
            quantity: 1,
            amount: 2000
        },
        {
            item: "USB_EXT",
            description: "USB Cable Extender",
            quantity: 1,
            amount: 2000
        },
        {
            item: "USB_EXT",
            description: "USB Cable Extender",
            quantity: 1,
            amount: 2000
        },
        {
            item: "USB_EXT",
            description: "USB Cable Extender",
            quantity: 1,
            amount: 2000
        },
        {
            item: "USB_EXT",
            description: "USB Cable Extender",
            quantity: 1,
            amount: 2000
        },
        {
            item: "USB_EXT",
            description: "USB Cable Extender",
            quantity: 1,
            amount: 2000
        },
        {
            item: "USB_EXT",
            description: "USB Cable Extender",
            quantity: 1,
            amount: 2000
        },
        {
            item: "USB_EXT",
            description: "USB Cable Extender",
            quantity: 1,
            amount: 2000
        },
        {
            item: "USB_EXT",
            description: "USB Cable Extender",
            quantity: 1,
            amount: 2000
        },
        {
            item: "USB_EXT",
            description: "USB Cable Extender",
            quantity: 1,
            amount: 2000
        },
        {
            item: "USB_EXT",
            description: "USB Cable Extender",
            quantity: 1,
            amount: 2000
        },
        {
            item: "USB_EXT",
            description: "USB Cable Extender",
            quantity: 1,
            amount: 2000
        },
        {
            item: "USB_EXT",
            description: "USB Cable Extender",
            quantity: 1,
            amount: 2000
        },
        {
            item: "USB_EXT",
            description: "USB Cable Extender",
            quantity: 1,
            amount: 2000
        },
        {
            item: "USB_EXT",
            description: "USB Cable Extender",
            quantity: 1,
            amount: 2000
        },
    ],
    subtotal: 8000,
    paid: 0,
    invoice_nr: 1234
};

app.get('/', async (req, res) => {
    res.json({ 'Status': 200 })
});

app.post('/print/productssum', async (req, res) => {
    let doc = new pdfkit({ size: "A4", margin: 50 });
    invoice.items = await prisma.inventoryproducts.findMany({})
    const invoicenum = Math.floor(Math.random() * 1000000)
    const rowsperpage = 35
    const pages = Math.ceil(invoice.items.length / rowsperpage)
    console.log(pages)
    const customFont = fs.readFileSync(`Tajawal-Light.ttf`);
    doc.registerFont(`Tajawal-Light`, customFont);
    var index1 = 0
    for (let index = 0; index < pages; index++) {
        //draw header
        doc
            .image("logo.png", 50, 45, { width: 50 })
            .fillColor("#444444")
            .fontSize(20)
            .text("B2B Corp.", 110, 57)
            .fontSize(10)
            .text("B2B Corp.", 200, 50, { align: "right" })
            .text("kom hamada", 200, 65, { align: "right" })
            .text("egypt, behira , 22821", 200, 80, { align: "right" })
            .moveDown();



        // draw detaild
        doc
            .fillColor("#444444")
            .fontSize(20)
            .text("Report", 50, 100);

        generateHr(doc, 125);

        const customerInformationTop = 140;

        doc
            .fontSize(10)
            .text("Report Number:", 50, customerInformationTop)
            .font("Helvetica-Bold")
            .text(invoicenum, 150, customerInformationTop)
            .font("Helvetica")
            .text("Report Date:", 50, customerInformationTop + 15)
            .text(formatDate(new Date()), 150, customerInformationTop + 15)
            .text("Page Number : ", 50, customerInformationTop + 30)
            .text(
                index + 1,
                150,
                customerInformationTop + 30
            )

        // .font("Helvetica-Bold")
        // .text(invoice.shipping.name, 300, customerInformationTop)
        // .font("Helvetica")
        // .text(invoice.shipping.address, 300, customerInformationTop + 15)
        // .text(
        //     invoice.shipping.city +
        //     ", " +
        //     invoice.shipping.state +
        //     ", " +
        //     invoice.shipping.country,
        //     300,
        //     customerInformationTop + 30
        // )
        // .moveDown();

        generateHr(doc, 192);




        //draw table
        let i;
        const invoiceTableTop = 230;

        doc.font("Helvetica-Bold");
        doc
            .fontSize(10)
            .text('id', 50, invoiceTableTop, { features: ['rtla'] })
            .text('Item Name', 80, invoiceTableTop, { features: ['rtla'] })
            .text('Quantity', 460, invoiceTableTop, { width: 90, align: "right" });
        generateHr(doc, invoiceTableTop + 10);
        doc.font("Tajawal-Light");
        for (i = 1; i <= rowsperpage; i++) {
            if (index1 >= invoice.items.length) {
                console.log('end')
            } else {
                const item = invoice.items[index1];
                var position = invoiceTableTop + (i) * 15;
                doc
                    .fontSize(10)
                    .text(index1 + 1, 50, position, { features: ['rtla'] })
                    .text(item.name, 80, position, { features: ['rtla'] })
                    .text(item.quantity, 460, position, { width: 90, align: "right" });
                generateHr(doc, invoiceTableTop + 10);
                generateHr(doc, position + 10);
                index1++
                console.log(index1)
            }
        }
        doc
            .fontSize(10)
            .text(
                "Thank you for your business.",
                50,
                770,
                { align: "center", width: 500 }
            );
        if (index < pages - 1) {
            doc.addPage()
        }
    }
    doc.end();
    const date = await new Date()

    console.log(date.toJSON())
    const file = 'IR' + invoicenum + '_' + date.toJSON().split('T')[0] + '.pdf';
    doc.pipe(fs.createWriteStream('files/' + file));
    res.json({ 'Status': 200, file })
});



app.post('/print/clientsum', async (req, res) => {
    let doc = new pdfkit({ size: "A4", margin: 50 });
    invoice.items = await prisma.clients.findMany({})
    const invoicenum = Math.floor(Math.random() * 1000000)
    const rowsperpage = 35
    const pages = Math.ceil(invoice.items.length / rowsperpage)
    console.log(pages)
    const customFont = fs.readFileSync(`Tajawal-Light.ttf`);
    doc.registerFont(`Tajawal-Light`, customFont);
    var index1 = 0
    for (let index = 0; index < pages; index++) {
        //draw header
        doc
            .image("logo.png", 50, 45, { width: 50 })
            .fillColor("#444444")
            .fontSize(20)
            .text("B2B Corp.", 110, 57)
            .fontSize(10)
            .text("B2B Corp.", 200, 50, { align: "right" })
            .text("kom hamada", 200, 65, { align: "right" })
            .text("egypt, behira , 22821", 200, 80, { align: "right" })
            .moveDown();



        // draw detaild
        doc
            .fillColor("#444444")
            .fontSize(20)
            .text("clients Summery", 50, 100);

        generateHr(doc, 125);

        const customerInformationTop = 140;

        doc
            .fontSize(10)
            .text("Report Number:", 50, customerInformationTop)
            .font("Helvetica-Bold")
            .text(invoicenum, 150, customerInformationTop)
            .font("Helvetica")
            .text("Report Date:", 50, customerInformationTop + 15)
            .text(formatDate(new Date()), 150, customerInformationTop + 15)
            .text("Page Number : ", 50, customerInformationTop + 30)
            .text(
                index + 1,
                150,
                customerInformationTop + 30
            )

        // .font("Helvetica-Bold")
        // .text(invoice.shipping.name, 300, customerInformationTop)
        // .font("Helvetica")
        // .text(invoice.shipping.address, 300, customerInformationTop + 15)
        // .text(
        //     invoice.shipping.city +
        //     ", " +
        //     invoice.shipping.state +
        //     ", " +
        //     invoice.shipping.country,
        //     300,
        //     customerInformationTop + 30
        // )
        // .moveDown();

        generateHr(doc, 192);




        //draw table
        let i;
        const invoiceTableTop = 230;

        doc.font("Tajawal-Light");
        doc
            .fontSize(10)
            .text('م', 50, invoiceTableTop, { features: ['rtla'] })
            .text('الاسم', 80, invoiceTableTop, { features: ['rtla'] })
            .text('مدين', 270, invoiceTableTop, { features: ['rtla'] })
            .text('دائن', 400, invoiceTableTop, { features: ['rtla'] })
            .text('الرصيد', 460, invoiceTableTop, { width: 90, align: "right" });
        generateHr(doc, invoiceTableTop + 10);
        doc.font("Tajawal-Light");
        for (i = 1; i <= rowsperpage; i++) {
            if (index1 >= invoice.items.length) {
                console.log('end')
            } else {
                const item = invoice.items[index1];
                var position = invoiceTableTop + (i) * 15;
                doc
                    .fontSize(10)
                    .text(index1 + 1, 50, position, { features: ['rtla'] })
                    .text(item.name, 80, position, { features: ['rtla'] })
                    .text(item.payment, 270, position, { width: 90 })
                    .text(item.expense, 400, position, { width: 90 })
                    .text(item.payment - item.expense, 460, position, { width: 90, align: "right" });
                generateHr(doc, invoiceTableTop + 10);
                generateHr(doc, position + 10);
                index1++
                console.log(index1)
            }
        }
        doc
            .fontSize(10)
            .text(
                "Thank you for your business.",
                50,
                770,
                { align: "center", width: 500 }
            );
        if (index < pages - 1) {
            doc.addPage()
        }
    }
    doc.end();
    const date = await new Date()

    console.log(date.toJSON())
    const file = 'CS' + invoicenum + '_' + date.toJSON().split('T')[0] + '.pdf';
    doc.pipe(fs.createWriteStream('files/' + file));
    res.json({ 'Status': 200, file })
});


app.post('/print/lots', async (req, res) => {
    const { rows } = req.body
    let doc = new pdfkit({ size: "A4", margin: 20, layout: 'landscape' });
    invoice.items = rows
    const invoicenum = Math.floor(Math.random() * 1000000)
    const rowsperpage = 21
    const pages = Math.ceil(invoice.items.length / rowsperpage)
    console.log(pages)
    const customFont = fs.readFileSync(`Tajawal-Light.ttf`);
    doc.registerFont(`Tajawal-Light`, customFont);
    var index1 = 0
    for (let index = 0; index < pages; index++) {
        //draw header
        doc
            .image("logo.png", 20, 45, { width: 50 })
            .fillColor("#444444")
            .fontSize(20)
            .text("B2B Corp.", 80, 57)
            .fontSize(10)
            .text("B2B Corp.", 200, 50, { align: "right" })
            .text("kom hamada", 200, 65, { align: "right" })
            .text("egypt, behira , 22821", 200, 80, { align: "right" })
            .moveDown();



        // draw detaild
        doc
            .fillColor("#444444")
            .fontSize(20)
            .text("clients Summery", 20, 100);

        linelandscape(doc, 125);

        const customerInformationTop = 140;

        doc
            .fontSize(10)
            .text("Report Number:", 20, customerInformationTop)
            .font("Helvetica-Bold")
            .text(invoicenum, 120, customerInformationTop)
            .font("Helvetica")
            .text("Report Date:", 20, customerInformationTop + 15)
            .text(formatDate(new Date()), 120, customerInformationTop + 15)
            .text("Page Number : ", 20, customerInformationTop + 30)
            .text(
                index + 1,
                120,
                customerInformationTop + 30
            )

        // .font("Helvetica-Bold")
        // .text(invoice.shipping.name, 300, customerInformationTop)
        // .font("Helvetica")
        // .text(invoice.shipping.address, 300, customerInformationTop + 15)
        // .text(
        //     invoice.shipping.city +
        //     ", " +
        //     invoice.shipping.state +
        //     ", " +
        //     invoice.shipping.country,
        //     300,
        //     customerInformationTop + 30
        // )
        // .moveDown();

        linelandscape(doc, 192);




        //draw table
        let i;
        const invoiceTableTop = 195;

        doc.font("Tajawal-Light");
        doc
            .fontSize(10)
            .text('م', 20, invoiceTableTop, { features: ['rtla'] })
            .text('المورد', 35, invoiceTableTop, { features: ['rtla'] })
            .text('الصنف', 165, invoiceTableTop, { features: ['rtla'] })
            .text('الكميه الابتدائيه', 310, invoiceTableTop, { features: ['rtla'] })
            .text('الكميه الحالية', 390, invoiceTableTop, { features: ['rtla'] })
            .text('سعر القطعه', 460, invoiceTableTop, { features: ['rtla'] })
            .text('السعر الكلي', 530, invoiceTableTop, { features: ['rtla'] })
            .text('باقي الرصيد', 590, invoiceTableTop, { features: ['rtla'] })
            .text('مرتجع؟', 650, invoiceTableTop, { features: ['rtla'] })
            .text('فاتوره', 710, invoiceTableTop, { features: ['rtla'] })
            .text('تاريخ الاستلام', 760, invoiceTableTop, { features: ['rtla'] });
        linelandscape(doc, invoiceTableTop + 10);
        doc.font("Tajawal-Light");
        for (i = 1; i <= rowsperpage; i++) {
            if (index1 >= invoice.items.length) {
                console.log('end')
            } else {
                const item = invoice.items[index1];
                var position = invoiceTableTop + (i) * 16;
                doc
                    .font("Tajawal-Light")
                    .fontSize(10)
                    .text(index1 + 1, 20, position, { features: ['rtla'] })
                    .text(item.from, 35, position, { features: ['rtla'] })
                    .text(item.to, 165, position, { features: ['rtla'] })
                    .font("Helvetica-Bold")
                    .text(item.amount.toFixed(3), 310, position, { features: ['rtla'] })
                    .text(item.remaining.toFixed(3), 390, position, { features: ['rtla'] })
                    .text(item.price.toFixed(3), 460, position, { features: ['rtla'] })
                    .text((item.amount * item.price).toFixed(3), 530, position, { features: ['rtla'] })
                    .text((item.price * item.remaining).toFixed(3), 590, position, { features: ['rtla'] })
                    .text(item.type == 1 ? "'Y" : "'N", 650, position, { features: ['rtla'] })
                    .text(item.refid, 710, position, { features: ['rtla'] })
                    .text(item.time.split('T')[0], 760, position, { features: ['rtla'] });
                linelandscape(doc, invoiceTableTop + 11);
                linelandscape(doc, position + 11);
                index1++
                console.log(index1)
            }
        }
        doc
            .fontSize(10)
            .text(
                "Thank you for your business.",
                160,
                560,
                { align: "center", width: 500 }
            );
        if (index < pages - 1) {
            doc.addPage()
        }
    }
    doc.end();
    const date = await new Date()

    console.log(date.toJSON())
    const file = 'CS' + invoicenum + '_' + date.toJSON().split('T')[0] + '.pdf';
    doc.pipe(fs.createWriteStream('files/' + file));
    res.json({ 'Status': 200, file })
});




app.post('/print/vaultsummeryy', async (req, res) => {
    const { rows } = req.body
    let doc = new pdfkit({ size: "A4", margin: 20, layout: 'landscape' });
    invoice.items = rows
    const invoicenum = Math.floor(Math.random() * 1000000)
    const rowsperpage = 21
    const pages = Math.ceil(invoice.items.length / rowsperpage)
    console.log(pages)
    const customFont = fs.readFileSync(`Tajawal-Light.ttf`);
    doc.registerFont(`Tajawal-Light`, customFont);
    var index1 = 0
    for (let index = 0; index < pages; index++) {
        //draw header
        doc
            .image("newlogo.png", 20, 45, { width: 200 })
            .fillColor("#444444")
            .fontSize(10)
            .text("B2B Corp.", 200, 50, { align: "right" })
            .text("kom hamada", 200, 65, { align: "right" })
            .text("egypt, behira , 22821", 200, 80, { align: "right" })
            .moveDown();



        // draw detaild
        doc
            .fillColor("#444444")
            .fontSize(20)
            .text("vault Summery", 20, 100);

        linelandscape(doc, 125);

        const customerInformationTop = 140;

        doc
            .fontSize(10)
            .text("Report Number:", 20, customerInformationTop)
            .font("Helvetica-Bold")
            .text('VS' + invoicenum, 120, customerInformationTop)
            .font("Helvetica")
            .text("Report Date:", 20, customerInformationTop + 15)
            .text(formatDate(new Date()), 120, customerInformationTop + 15)
            .text("Page Number : ", 20, customerInformationTop + 30)
            .text(
                index + 1,
                120,
                customerInformationTop + 30
            )

        // .font("Helvetica-Bold")
        // .text(invoice.shipping.name, 300, customerInformationTop)
        // .font("Helvetica")
        // .text(invoice.shipping.address, 300, customerInformationTop + 15)
        // .text(
        //     invoice.shipping.city +
        //     ", " +
        //     invoice.shipping.state +
        //     ", " +
        //     invoice.shipping.country,
        //     300,
        //     customerInformationTop + 30
        // )
        // .moveDown();

        linelandscape(doc, 192);




        //draw table
        let i;
        const invoiceTableTop = 195;

        doc.font("Tajawal-Light");
        doc
            .fontSize(10)
            .text('م', 20, invoiceTableTop, { features: ['rtla'] })
            .text('الخزينه', 35, invoiceTableTop, { features: ['rtla'] })
            .text('العمليه', 165, invoiceTableTop, { features: ['rtla'] })
            .text('المعامل', 310, invoiceTableTop, { features: ['rtla'] })
            .text('وارد', 460, invoiceTableTop, { features: ['rtla'] })
            .text('منصرف', 550, invoiceTableTop, { features: ['rtla'] })
            .text('الرصيد', 630, invoiceTableTop, { features: ['rtla'] })
            .text('فاتوره', 710, invoiceTableTop, { features: ['rtla'] })
            .text('تاريخ العمليه', 765, invoiceTableTop, { features: ['rtla'] });
        linelandscape(doc, invoiceTableTop + 10);
        doc.font("Tajawal-Light");
        for (i = 1; i <= rowsperpage; i++) {
            if (index1 >= invoice.items.length) {
                console.log('end')
            } else {
                const item = invoice.items[index1];
                var position = invoiceTableTop + (i) * 16;
                doc
                    .font("Tajawal-Light")
                    .fontSize(10)
                    .text(index1 + 1, 20, position, {})
                    .text(fixtext(item.vaultName), 35, position, { features: ['ltra'] })
                    .text(fixtext(item.Category), 165, position, { features: ['ltra'] })
                    .text(fixtext(item.OperatorName), 310, position, { features: ['ltra'] })
                    .font("Helvetica-Bold")
                    .text(Number(item.Income) == 0 ? '' : Number(item.Income).toFixed(2).toString().split('.')[1] == '00' ? Number(item.Income) : Number(item.Income).toFixed(2), 460, position, {})
                    .text(Number(item.Outcome) == 0 ? '' : Number(item.Outcome).toFixed(2).toString().split('.')[1] == '00' ? Number(item.Outcome) : Number(item.Outcome).toFixed(2), 550, position, {})
                    .text(Number(item.Value).toFixed(2).toString().split('.')[1] == '00' ? Number(item.Value) : Number(item.Value).toFixed(2), 630, position, {})
                    .text(item.refid, 710, position, {})
                    .text(item.Date, 765, position, {});
                linelandscape(doc, invoiceTableTop + 11);
                linelandscape(doc, position + 11);
                index1++
                console.log(index1)
            }
        }
        doc
            .fontSize(10)
            .text(
                "Thank you for your business.",
                160,
                560,
                { align: "center", width: 500 }
            );
        if (index < pages - 1) {
            doc.addPage()
        }
    }
    doc.end();
    const date = await new Date()

    console.log(date.toJSON())
    const file = 'VS' + invoicenum + '_' + date.toJSON().split('T')[0] + '.pdf';
    doc.pipe(fs.createWriteStream('files/' + file));
    res.json({ 'Status': 200, file })
});

app.post('/print/vaultsummery', async (req, res) => {
    var rows = []
    const { vaultname } = req.body
    var vaultt = await prisma.vault.findMany({
        where: {
            name: vaultname
        }
    })
    console.log(vaultt)
    var summeryarray = [];
    if (vaultt.length < 1) {
        res.status(200).json({ "status": 200, "error": "not found" })
        return
    }
    const vault = vaultt[0]
    // await prisma.vault.update({
    //     where: {
    //         id: vault.id
    //     },
    //     data: {
    //         value: 0
    //     }
    // })
    const ownertrans = await prisma.mtransaction.findMany({
        where: {
            toid: vault.id
        }
    })
    const clients = await prisma.clientvaulttransaction.findMany({
        where: {
            fromid: vault.id
        }
    })
    const vaultout = await prisma.transaction.findMany({
        where: {
            fromid: vault.id
        }
    })
    const vaultin = await prisma.transaction.findMany({
        where: {
            toid: vault.id
        }
    })
    const expenses = await prisma.expenses.findMany({
        where: {
            vaultid: vault.id
        }
    })
    const wtrans = await prisma.wtransaction.findMany({
        where: {
            fromid: vault.id
        }
    })
    //money owners
    for (let index = 0; index < ownertrans.length; index++) {
        const element = ownertrans[index];
        if (element.way == 'in') {
            summeryarray.push({
                "refid": element.refid,
                "vaultName": element.toname,
                "OperatorName": element.fromname,
                "Date": element.time.toISOString().toString().split('T')[0],
                "Income": element.amount,
                "Outcome": '',
                "Category": 'ايراد من شريك'
            })
        } else {
            summeryarray.push({
                "refid": element.refid,
                "vaultName": element.toname,
                "OperatorName": element.fromname,
                "Date": element.time.toISOString().toString().split('T')[0],
                "Income": '',
                "Outcome": element.amount,
                "Category": 'منصرف لشريك'
            })
        }

        // const v = await prisma.vault.findUnique({
        //     where: {
        //         id: vault.id
        //     }
        // })
        // await prisma.vault.update({
        //     where: {
        //         id: v.id
        //     },
        //     data: {
        //         value: v.value + element.amount
        //     }
        // })
    }
    //vault income transactions
    for (let index = 0; index < vaultin.length; index++) {
        const element = vaultin[index];
        summeryarray.push({
            "refid": element.refid,
            "vaultName": element.toname,
            "OperatorName": element.fromname,
            "Date": element.time.toISOString().toString().split('T')[0],
            "Income": element.amount,
            "Outcome": '',
            "Category": 'ايراد من خزينه اخرى'
        })
        // const v = await prisma.vault.findUnique({
        //     where: {
        //         id: vault.id
        //     }
        // })
        // await prisma.vault.update({
        //     where: {
        //         id: v.id
        //     },
        //     data: {
        //         value: v.value + element.amount
        //     }
        // })
    }
    //vault outcome transactions
    for (let index = 0; index < vaultout.length; index++) {
        const element = vaultout[index];
        summeryarray.push({
            "refid": element.refid,
            "vaultName": element.fromname,
            "OperatorName": element.toname,
            "Date": element.time.toISOString().toString().split('T')[0],
            "Income": '',
            "Outcome": element.amount,
            "Category": 'منصرف الي خزينه اخرى'
        })

        // const v = await prisma.vault.findUnique({
        //     where: {
        //         id: vault.id
        //     }
        // })
        // await prisma.vault.update({
        //     where: {
        //         id: v.id
        //     },
        //     data: {
        //         value: v.value - element.amount
        //     }
        // })
    }
    //expenses outcome transactions
    for (let index = 0; index < expenses.length; index++) {
        const element = expenses[index];
        summeryarray.push({
            "refid": element.refid,
            "vaultName": element.vaultname,
            "OperatorName": element.nestedcategoryname,
            "Date": element.time.toISOString().toString().split('T')[0],
            "Income": '',
            "Outcome": element.amount,
            "Category": 'مصروفات'
        })

        // const v = await prisma.vault.findUnique({
        //     where: {
        //         id: vault.id
        //     }
        // })
        // await prisma.vault.update({
        //     where: {
        //         id: v.id
        //     },
        //     data: {
        //         value: v.value - element.amount
        //     }
        // })
    }
    //workers outcome transactions
    for (let index = 0; index < wtrans.length; index++) {
        const element = wtrans[index];
        summeryarray.push({
            "refid": element.refid,
            "vaultName": element.fromname,
            "OperatorName": element.toname,
            "Date": element.time.toISOString().toString().split('T')[0],
            "Income": '',
            "Outcome": element.amount,
            "Category": 'دفعات مقاولين'
        })

        // const v = await prisma.vault.findUnique({
        //     where: {
        //         id: vault.id
        //     }
        // })
        // await prisma.vault.update({
        //     where: {
        //         id: v.id
        //     },
        //     data: {
        //         value: v.value - element.amount
        //     }
        // })
    }
    //clients transactions
    for (let index = 0; index < clients.length; index++) {
        const element = clients[index];
        if (element.way == 'out') {
            summeryarray.push({
                "refid": element.refid,
                "vaultName": element.fromname,
                "OperatorName": element.toname,
                "Date": element.time.toISOString().toString().split('T')[0],
                "Income": '',
                "Outcome": element.amount,
                "Category": 'منصرف الى عميل/مورد'
            })

            // const v = await prisma.vault.findUnique({
            //     where: {
            //         id: vault.id
            //     }
            // })
            // await prisma.vault.update({
            //     where: {
            //         id: v.id
            //     },
            //     data: {
            //         value: v.value - element.amount
            //     }
            // })
        } else {
            summeryarray.push({
                "refid": element.refid,
                "vaultName": element.fromname,
                "OperatorName": element.toname,
                "Date": element.time.toISOString().toString().split('T')[0],
                "Income": element.amount,
                "Outcome": '',
                "Category": 'وارد من عميل/مورد'
            })

            // const v = await prisma.vault.findUnique({
            //     where: {
            //         id: vault.id
            //     }
            // })
            // await prisma.vault.update({
            //     where: {
            //         id: v.id
            //     },
            //     data: {
            //         value: v.value + element.amount
            //     }
            // })
        }
    }
    summeryarray.sort((a, b) => {
        return new Date(a.Date) - new Date(b.Date)
    })
    let val = 0;
    for (let index = 0; index < summeryarray.length; index++) {
        const element = summeryarray[index];
        summeryarray[index].id = index + 1;
        val = val - element.Outcome;
        val = val + element.Income;
        summeryarray[index].Value = val;
    }
    rows = summeryarray
    let doc = new pdfkit({ size: "A4", margin: 20, layout: 'portrait' });
    invoice.items = rows
    const invoicenum = Math.floor(Math.random() * 1000000)
    const rowsperpage = 35
    const pages = Math.ceil(invoice.items.length / rowsperpage)
    console.log(pages)
    const customFont = fs.readFileSync(`Tajawal-Light.ttf`);
    doc.registerFont(`Tajawal-Light`, customFont);
    var index1 = 0
    for (let index = 0; index < pages; index++) {
        //draw header
        doc
            .image("newlogo.png", 20, 45, { width: 200 })
            .fillColor("#444444")
            .fontSize(10)
            .text("B2B Corp.", 200, 50, { align: "right" })
            .text("kom hamada", 200, 65, { align: "right" })
            .text("egypt, behira , 22821", 200, 80, { align: "right" })
            .moveDown();



        // draw detaild
        doc
            .fillColor("#444444")
            .fontSize(20)
            .text("vault Summery", 20, 100);

        generateHr(doc, 125);

        const customerInformationTop = 130;

        doc
            .fontSize(10)
            .font("Helvetica")
            .text("vault Name : ", 20, customerInformationTop)
            .font("Tajawal-Light")
            .text(
                rows.length > 1 ? rows[0].vaultName.toString() : 'Empty',
                120,
                customerInformationTop,
                { features: ['rtla'] }
            )
            .font("Helvetica")
            .text("Report Number:", 20, customerInformationTop + 15)
            .font("Helvetica-Bold")
            .text('VS' + invoicenum, 120, customerInformationTop + 15)
            .font("Helvetica")
            .text("Report Date:", 20, customerInformationTop + 30)
            .text(formatDate(new Date()), 120, customerInformationTop + 30)
            .text("Page Number : ", 20, customerInformationTop + 45)
            .text(
                index + 1,
                120,
                customerInformationTop + 45
            )


        // .font("Helvetica-Bold")
        // .text(invoice.shipping.name, 300, customerInformationTop)
        // .font("Helvetica")
        // .text(invoice.shipping.address, 300, customerInformationTop + 15)
        // .text(
        //     invoice.shipping.city +
        //     ", " +
        //     invoice.shipping.state +
        //     ", " +
        //     invoice.shipping.country,
        //     300,
        //     customerInformationTop + 30
        // )
        // .moveDown();

        generateHr(doc, 192);




        //draw table
        let i;
        const invoiceTableTop = 195;

        doc.font("Tajawal-Light");
        doc
            .fontSize(10)
            .text('م', 20, invoiceTableTop, { features: ['rtla'] })
            .text('العمليه', 55, invoiceTableTop, { features: ['rtla'] })
            .text('المعامل', 155, invoiceTableTop, { features: ['rtla'] })
            .text('وارد', 330, invoiceTableTop, { features: ['rtla'] })
            .text('منصرف', 380, invoiceTableTop, { features: ['rtla'] })
            .text('الرصيد', 430, invoiceTableTop, { features: ['rtla'] })
            .text('فاتوره', 480, invoiceTableTop, { features: ['rtla'] })
            .text('تاريخ العمليه', 510, invoiceTableTop, { features: ['rtla'], align: 'right' });
        generateHr(doc, invoiceTableTop + 10);
        doc.font("Tajawal-Light");
        for (i = 1; i <= rowsperpage; i++) {
            if (index1 >= invoice.items.length) {
                console.log('end')
            } else {
                const item = invoice.items[index1];
                var position = invoiceTableTop + (i) * 16;
                doc
                    .font("Tajawal-Light")
                    .fontSize(10)
                    .text(index1 + 1, 20, position, {})
                    .text(fixtext(item.Category), 55, position, { features: ['ltra'] })
                    .text(fixtext(item.OperatorName), 155, position, { features: ['ltra'] })
                    .font("Helvetica-Bold")
                    .text(Number(item.Income) == 0 ? '' : Number(item.Income).toFixed(2).toString().split('.')[1] == '00' ? Number(item.Income) : Number(item.Income).toFixed(2), 330, position, {})
                    .text(Number(item.Outcome) == 0 ? '' : Number(item.Outcome).toFixed(2).toString().split('.')[1] == '00' ? Number(item.Outcome) : Number(item.Outcome).toFixed(2), 380, position, {})
                    .text(Number(item.Value).toFixed(2).toString().split('.')[1] == '00' ? Number(item.Value) : Number(item.Value).toFixed(2), 430, position, {})
                    .text(item.refid, 480, position, {})
                    .text(item.Date, 510, position, { align: 'right' });
                generateHr(doc, invoiceTableTop + 11);
                generateHr(doc, position + 11);
                index1++
                console.log(index1)
            }
        }
        doc
            .fontSize(10)
            .text(
                "Thank you for your business.",
                50,
                800,
                { align: "center", width: 500 }
            );
        if (index < pages - 1) {
            doc.addPage()
        }
    }
    doc.end();
    const date = await new Date()

    console.log(date.toJSON())
    const file = 'VS' + invoicenum + '_' + date.toJSON().split('T')[0] + '.pdf';
    doc.pipe(fs.createWriteStream('files/' + file));
    res.json({ 'Status': 200, file })
});
app.post('/print/clientsummery', async (req, res) => {
    const { rows } = req.body
    console.log(rows)
    let doc = new pdfkit({ size: "A4", margin: 50 });
    invoice.items = rows
    const invoicenum = Math.floor(Math.random() * 1000000)
    const rowsperpage = 35
    const pages = Math.ceil(invoice.items.length / rowsperpage)
    console.log(pages)
    const customFont = fs.readFileSync(`Tajawal-Light.ttf`);
    doc.registerFont(`Tajawal-Light`, customFont);
    var index1 = 0
    for (let index = 0; index < pages; index++) {
        //draw header
        doc
            .image("newlogo.png", 50, 45, { width: 200 })
            .fillColor("#444444")
            .fontSize(10)
            .text("B2B Corp.", 200, 50, { align: "right" })
            .text("kom hamada", 200, 65, { align: "right" })
            .text("egypt, behira , 22821", 200, 80, { align: "right" })
            .moveDown();



        // draw detaild
        doc
            .fillColor("#444444")
            .fontSize(20)
            .text("clients Summery", 50, 100);

        generateHr(doc, 125);

        const customerInformationTop = 140;

        doc
            .fontSize(10)
            .text("Report Number:", 50, customerInformationTop)
            .font("Helvetica-Bold")
            .text('CS' + invoicenum, 150, customerInformationTop)
            .font("Helvetica")
            .text("Report Date:", 50, customerInformationTop + 15)
            .text(formatDate(new Date()), 150, customerInformationTop + 15)
            .text("Page Number : ", 50, customerInformationTop + 30)
            .text(
                index + 1,
                150,
                customerInformationTop + 30
            )

        // .font("Helvetica-Bold")
        // .text(invoice.shipping.name, 300, customerInformationTop)
        // .font("Helvetica")
        // .text(invoice.shipping.address, 300, customerInformationTop + 15)
        // .text(
        //     invoice.shipping.city +
        //     ", " +
        //     invoice.shipping.state +
        //     ", " +
        //     invoice.shipping.country,
        //     300,
        //     customerInformationTop + 30
        // )
        // .moveDown();


        var iiii = 0

        //draw table
        let i;
        const invoiceTableTop = 180;
        doc.font("Tajawal-Light");
        var indexxxx = 0
        var margin = 0
        for (i = 1; i <= rowsperpage; i++) {
            if (index1 >= invoice.items.length) {
                console.log('end')
            } else {
                const item = invoice.items[index1];
                var position = invoiceTableTop + (i) * 15 + margin;
                if (item.id == 'hed') {
                    // doc
                    //     .fontSize(10)
                    //     .text('م', position, { features: ['rtla'] })
                    //     .text('ss', 80, position, { features: ['rtla'] })
                    //     .text('dd', 200, position, { width: 90, features: ['rtla'] })
                    //     .text('s', 320, position, { width: 90, features: ['rtla'] })
                    //     .text('ss', 420, position, { width: 90, features: ['rtla'] })
                    //     .text('s', 460, position, { width: 90, align: "right", features: ['rtla'] });
                    // generateHr(doc, invoiceTableTop + 10);
                    // generateHr(doc, position + 10);
                }
                if (item.id == 'Stop') {
                    console.log('break')
                    doc
                        .fillColor("#000000")
                        .fontSize(13)
                        .text(
                            iiii == 0 ?
                                "مواد التعبأه "
                                :
                                iiii == 1 ?
                                    'مواد التعبأه الوارده'
                                    :
                                    iiii == 2 ?
                                        'المنتج النهائي الوارد'
                                        :
                                        'الرصيد'
                            , 50, position + 20, { align: "right", features: ['rtla'] });
                    iiii++
                    generateHr(doc, position + 40);
                    margin = margin + 30
                    indexxxx = 0
                } else {
                    console.log(item.clientname)
                    doc
                        .fontSize(10)
                        .text(indexxxx == 0 ? iiii == 3 ? 'م' : 'م' : iiii == 3 ? indexxxx : indexxxx, 50, position, { features: ['rtla'] })
                        .text(indexxxx == 0 ? iiii == 3 ? 'اسم العميل' : 'اسم العميل' : item.clientname, 80, position, { features: ['rtla'] })
                        .text(indexxxx == 0 ? iiii == 3 ? "الصنف" : "الصنف" : item.productname, 200, position, { width: 90, features: ['rtla'] })
                        .text(indexxxx == 0 ? iiii == 3 ? "الكميه" : '' : iiii == 3 ? item.amount : "", 320, position, { width: 90, features: ['rtla'] })
                        .text(indexxxx == 0 ? iiii == 3 ? "مرتجع" : '' : iiii == 3 ? item.return : "", 420, position, { width: 90, features: ['rtla'] })
                        .text(indexxxx == 0 ? iiii == 3 ? 'اجمالى الكميه' : 'اجمالى الكميه' : item.amount - item.return, 460, position, { width: 90, align: "right", features: ['rtla'] });
                    generateHr(doc, invoiceTableTop + 10);
                    generateHr(doc, position + 10);
                    indexxxx++
                }
                index1++
                console.log(index1)
            }
        }
        doc
            .fontSize(10)
            .text(
                "Thank you for your business.",
                50,
                770,
                { align: "center", width: 500 }
            );
        if (index < pages - 1) {
            doc.addPage()
        }
    }
    doc.end();
    const date = await new Date()

    console.log(date.toJSON())
    const file = 'CS' + invoicenum + '_' + date.toJSON().split('T')[0] + '.pdf';
    doc.pipe(fs.createWriteStream('files/' + file));
    res.json({ 'Status': 200, file })
});

const generatepages = (doc, invoice) => {
}



function generateHeader(doc) {
    doc
        .image("logo.png", 50, 45, { width: 50 })
        .fillColor("#444444")
        .fontSize(20)
        .text("B2B Corp.", 110, 57)
        .fontSize(10)
        .text("B2B Corp.", 200, 50, { align: "right" })
        .text("kom hamada", 200, 65, { align: "right" })
        .text("egypt, behira , 22821", 200, 80, { align: "right" })
        .moveDown();
}

function generateCustomerInformation(doc, invoice) {
    doc
        .fillColor("#444444")
        .fontSize(20)
        .text("Invoice", 50, 160);

    generateHr(doc, 185);

    const customerInformationTop = 200;

    doc
        .fontSize(10)
        .text("Invoice Number:", 50, customerInformationTop)
        .font("Helvetica-Bold")
        .text(invoice.invoice_nr, 150, customerInformationTop)
        .font("Helvetica")
        .text("Invoice Date:", 50, customerInformationTop + 15)
        .text(formatDate(new Date()), 150, customerInformationTop + 15)
        .text("Balance Due:", 50, customerInformationTop + 30)
        .text(
            formatCurrency(invoice.subtotal - invoice.paid),
            150,
            customerInformationTop + 30
        )

        .font("Helvetica-Bold")
        .text(invoice.shipping.name, 300, customerInformationTop)
        .font("Helvetica")
        .text(invoice.shipping.address, 300, customerInformationTop + 15)
        .text(
            invoice.shipping.city +
            ", " +
            invoice.shipping.state +
            ", " +
            invoice.shipping.country,
            300,
            customerInformationTop + 30
        )
        .moveDown();

    generateHr(doc, 252);
}

function generateInvoiceTable(doc, invoice) {

    var indexx = 0;
    for (i = 0; i < invoice.items.length; i++) {
        const item = invoice.items[i];
        var position = invoiceTableTop + (indexx + 1) * 30;

        generateTableRow(
            doc,
            position,
            item.item,
            item.description,
            formatCurrency(item.amount / item.quantity),
            item.quantity,
            formatCurrency(item.amount)
        );

        generateHr(doc, position + 20);
        if (indexx == 2) {
            doc.addPage();
            indexx = 0;
            console.log('page')
        } else {
            indexx++
        }
        console.log(indexx)
    }

    const subtotalPosition = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
        doc,
        subtotalPosition,
        "",
        "",
        "Subtotal",
        "",
        formatCurrency(invoice.subtotal)
    );

    const paidToDatePosition = subtotalPosition + 20;
    generateTableRow(
        doc,
        paidToDatePosition,
        "",
        "",
        "Paid To Date",
        "",
        formatCurrency(invoice.paid)
    );

    const duePosition = paidToDatePosition + 25;
    doc.font("Helvetica-Bold");
    generateTableRow(
        doc,
        duePosition,
        "",
        "",
        "Balance Due",
        "",
        formatCurrency(invoice.subtotal - invoice.paid)
    );
    doc.font("Helvetica");
}

function generateFooter(doc) {
    doc
        .fontSize(10)
        .text(
            "Payment is due within 15 days. Thank you for your business.",
            50,
            780,
            { align: "center", width: 500 }
        );
}

function generateTableRow(
    doc,
    y,
    item,
    description,
    unitCost,
    quantity,
    lineTotal,
    id,
) {
    doc
        .fontSize(10)
        .text(id, 50, y, { features: ['rtla'] })
        .text(item, 80, y, { features: ['rtla'] })
        .text(description, 190, y)
        .text(unitCost, 280, y, { width: 90, align: "right" })
        .text(quantity, 370, y, { width: 90, align: "right" })
        .text(lineTotal, 0, y, { align: "right" });
}

function generateHr(doc, y) {
    doc
        .strokeColor("#aaaaaa")
        .lineWidth(1)
        .moveTo(20, y)
        .lineTo(580, y)
        .stroke();
}
function linelandscape(doc, y) {
    doc
        .strokeColor("#aaaaaa")
        .lineWidth(1)
        .moveTo(20, y)
        .lineTo(830, y)
        .stroke();
}
function formatCurrency(cents) {
    return "$" + (cents / 100).toFixed(2);
}

function formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return year + "/" + month + "/" + day;
}







































//done
app.get('/products', async (req, res) => {
    var ip = req.headers['x-forwarded-for'] || req.socket.remoteAdress

    console.log('product request from : ' + ip)
    const products = await prisma.inventoryproducts.findMany({
    })
    res.json({ 'status': 200, products })
})
app.post('/addproduct', async (req, res) => {
    const { code, name, selectmode, amount, price } = req.body
    var mesure = 0
    if (selectmode == 'unit') {
        mesure = 0
    } else
        if (selectmode == 'kg') {
            mesure = 1
        } else
            if (selectmode == 'M') {
                mesure = 2
            } else
                if (selectmode == 'm2') {
                    mesure = 3
                }


    console.log(mesure)
    const newproduct = await prisma.inventoryproducts.create({
        data: {
            name: name,
            wayofmesure: mesure,
            price: Number(price),
            quantity: Number(amount),
            net: Number(price) * Number(amount)
        }
    })
    res.status(200).json({ "status": 200, newproduct })
})
app.post('/editproduct', async (req, res) => {
    const { code, name, sel, selid, amount, price } = req.body
    var mesure = 0
    if (sel == 'unit') {
        mesure = 0
    } else
        if (sel == 'kg') {
            mesure = 1
        } else
            if (sel == 'M') {
                mesure = 2
            } else
                if (sel == 'm2') {
                    mesure = 3
                }

    console.log(mesure, req.body)
    const prod = await prisma.inventoryproducts.findUnique({
        where: {
            id: Number(selid)
        },
    })
    // const lotupdate = await prisma.products.updateMany({
    //     where: {
    //         to: prod.name
    //     },
    //     data: {
    //         to: name
    //     }
    // })
    const importupdate = await prisma.productincome.updateMany({
        where: {
            to: prod.name
        },
        data: {
            to: name
        }
    })
    const fridgeupdate = await prisma.fridgeproducts.updateMany({
        where: {
            to: prod.name
        },
        data: {
            to: name
        }
    })
    const exportupdate = await prisma.productoutcome.updateMany({
        where: {
            productname: prod.name
        },
        data: {
            productname: name
        }
    })
    const autoexports = await prisma.autoproductexports.updateMany({
        where: {
            productname: prod.name
        },
        data: {
            productname: name
        }
    })
    const editedproduct = await prisma.inventoryproducts.update({
        where: {
            id: Number(selid)
        },
        data: {
            code: Number(code),
            name: name,
            wayofmesure: mesure,
            price: Number(price),
            quantity: Number(amount),
            net: Number(price) * Number(amount)
        }
    })

    res.status(200).json({ "status": 200, editedproduct })
})
app.post('/searchproduct', async (req, res) => {
    const { searchtext } = req.body
    console.log(searchtext)
    const foundproduts = await prisma.inventoryproducts.findMany({
        where: {
            name: {
                contains: searchtext
            }
        }
    })

    res.status(200).json({ "status": 200, foundproduts })
})
app.post('/deleteproduct', async (req, res) => {
    const { deleteproduct } = req.body
    console.log(deleteproduct)
    const del = await prisma.inventoryproducts.deleteMany({
        where: {
            id: {
                in: deleteproduct.map(a => a.id),
            }
        }
    })
    const products = await prisma.inventoryproducts.findMany({
    })
    res.json({ 'status': 200, products })
})




app.get('/clients', async (req, res) => {
    console.log('clients request')
    const clients = await prisma.clients.findMany({
    })
    res.json({ 'status': 200, clients })
})
app.post('/addclients', async (req, res) => {
    const { code, name, selectmode, payments, expenses } = req.body
    var mesure = 0
    if (selectmode == 'seller') {
        mesure = 0
    } else
        if (selectmode == 'buyer') {
            mesure = 1
        } else
            if (selectmode == 'both') {
                mesure = 2
            }


    console.log(mesure)
    const newclient = await prisma.clients.create({
        data: {
            name: name,
            type: mesure,
            expense: Number(expenses),
            payment: Number(payments),
        }
    })
    res.status(200).json({ "status": 200, newclient })
})
app.post('/editclients', async (req, res) => {
    const { name, expenses, payments, code, selid, sel } = req.body
    var mesure = 0
    if (sel == 'seller') {
        mesure = 0
    } else
        if (sel == 'buyer') {
            mesure = 1
        } else
            if (sel == 'both') {
                mesure = 2
            }

    console.log(mesure, req.body)
    const editedclient = await prisma.clients.update({
        where: {
            id: Number(selid)
        },
        data: {
            name: name,
            type: mesure,
            expense: Number(expenses),
            payment: Number(payments),
        }
    })
    const editincome = await prisma.productincome.updateMany({
        where: {
            fromid: editedclient.id
        },
        data: {
            fromid: editedclient.id,
            from: editedclient.name
        }
    })
    const editedexports = await prisma.productoutcome.updateMany({
        where: {
            clientid: editedclient.id
        },
        data: {
            clientid: editedclient.id,
            clientname: editedclient.name
        }
    })
    const editedautoexp = await prisma.autoproductexports.updateMany({
        where: {
            clientid: editedclient.id
        },
        data: {
            clientid: editedclient.id,
            clientname: editedclient.name
        }
    })
    const editedfinal = await prisma.fridgeproducts.updateMany({
        where: {
            fromid: editedclient.id
        },
        data: {
            fromid: editedclient.id,
            from: editedclient.name
        }
    })
    const editedtrans = await prisma.clientvaulttransaction.updateMany({
        where: {
            toid: editedclient.id
        },
        data: {
            toid: editedclient.id,
            toname: editedclient.name
        }
    })
    // const editedlots = await prisma.products.updateMany({
    //     where: {
    //         fromid: editedclient.id
    //     },
    //     data: {
    //         from: editedclient.name,
    //         fromid: editedclient.id
    //     }
    // })
    const editedincome = await prisma.productincome.updateMany({
        where: {
            fromid: editedclient.id
        },
        data: {
            from: editedclient.name,
            fromid: editedclient.id
        }
    })
    res.status(200).json({ "status": 200, editedclient })
})
app.post('/searchclients', async (req, res) => {
    const { searchtext } = req.body
    console.log(searchtext)
    const foundproduts = await prisma.clients.findMany({
        where: {
            name: {
                contains: searchtext
            }
        }
    })

    res.status(200).json({ "status": 200, foundproduts })
})
app.post('/searchclientexports', async (req, res) => {
    const { searchtext } = req.body
    console.log(searchtext)
    const foundproduts = await prisma.productoutcome.findMany({
        where: {
            clientname: searchtext
        }
    })
    const expsum = foundproduts.reduce((acc, curr) => {
        const objInAcc = acc.find((o) => o.productid == curr.productid && o.productname == curr.productname);
        if (objInAcc) {
            objInAcc.amount += curr.amount;
        }
        else acc.push(curr);
        return acc;
    }, []);
    const exportsum = expsum
    res.status(200).json({ "status": 200, foundproduts, exportsum })
})



//done
app.get('/workers', async (req, res) => {
    console.log('product request')
    const clients = await prisma.workers.findMany({
    })
    res.json({ 'status': 200, clients })
})
app.post('/addworkers', async (req, res) => {
    const { name } = req.body
    const newclient = await prisma.workers.create({
        data: {
            name: name,
        }
    })
    res.status(200).json({ "status": 200, newclient })
})
app.post('/editworkers', async (req, res) => {
    const { name, payments, selid } = req.body
    const editedclient = await prisma.workers.update({
        where: {
            id: Number(selid)
        },
        data: {
            name: name,
            payment: Number(payments),
        }
    })
    res.status(200).json({ "status": 200, editedclient })
})
app.post('/searchworkers', async (req, res) => {
    const { searchtext } = req.body
    console.log(searchtext)
    const foundproduts = await prisma.workers.findMany({
        where: {
            name: {
                contains: searchtext
            }
        }
    })

    res.status(200).json({ "status": 200, foundproduts })
})
app.post('/deleteworkers', async (req, res) => {
    console.log('workers delete request')
    const { deleteproduct } = req.body
    const del = await prisma.workers.deleteMany({
        where: {
            id: {
                in: deleteproduct.map(a => a.id),
            }
        }
    })
    const workers = await prisma.workers.findMany({
    })
    res.json({ 'status': 200, workers })
})





app.get('/vault', async (req, res) => {
    console.log('vault request')
    const vault = await prisma.vault.findMany({
    })
    res.json({ 'status': 200, vault })
})
app.post('/addvault', async (req, res) => {
    const { code, name, value } = req.body
    const newclient = await prisma.vault.create({
        data: {
            name: name,
            value: Number(value),
        }
    })
    res.status(200).json({ "status": 200, newclient })
})
app.post('/editvault', async (req, res) => {
    const { name, value, code, selid } = req.body
    console.log(req.body)
    const editedvault = await prisma.vault.update({
        where: {
            id: Number(selid)
        },
        data: {
            code: Number(code),
            name: name,
            value: Number(value),
        }
    })
    res.status(200).json({ "status": 200, editedvault })
})
app.post('/searchvault', async (req, res) => {
    const { searchtext } = req.body
    console.log(searchtext)
    const foundproduts = await prisma.vault.findMany({
        where: {
            name: {
                contains: searchtext
            }
        }
    })

    res.status(200).json({ "status": 200, foundproduts })
})






app.get('/moneyowner', async (req, res) => {
    console.log('moneyowner request')
    const vault = await prisma.moneyowner.findMany({
    })
    res.json({ 'status': 200, vault })
})
app.post('/addmoneyowner', async (req, res) => {
    const { code, name, value } = req.body
    const newclient = await prisma.moneyowner.create({
        data: {
            name: name,
            value: Number(value),
            money: Number(value),
            payment: 0,
            payed: 0
        }
    })
    res.status(200).json({ "status": 200, newclient })
})
app.post('/editmoneyowner', async (req, res) => {
    const { name, value, code, selid } = req.body
    console.log(req.body)
    const editedvault = await prisma.moneyowner.update({
        where: {
            id: Number(selid)
        },
        data: {
            code: Number(code),
            name: name,
            value: Number(value),
        }
    })
    res.status(200).json({ "status": 200, editedvault })
})
app.post('/searchmoneyowner', async (req, res) => {
    const { searchtext } = req.body
    console.log(searchtext)
    const foundproduts = await prisma.moneyowner.findMany({
        where: {
            name: {
                contains: searchtext
            }
        }
    })

    res.status(200).json({ "status": 200, foundproduts })
})





app.get('/transaction', async (req, res) => {
    console.log('transaction request')
    const transaction = await prisma.transaction.findMany({
    })
    res.json({ 'status': 200, transaction })
})
app.get('/cvtransaction', async (req, res) => {
    const cvtransaction = await prisma.clientvaulttransaction.findMany({})
    res.status(200).json({ 'status': 200, cvtransaction })
})
app.get('/cmtransaction', async (req, res) => {
    const cvtransaction = await prisma.clientm.findMany({})
    res.status(200).json({ 'status': 200, cvtransaction })
})
app.post('/addtransaction', async (req, res) => {
    const { fromname, toname, amount, date, refid } = req.body
    console.log(req.body)
    const fromvault = await prisma.vault.findUnique({
        where: {
            id: Number(fromname)
        }
    })
    const tovault = await prisma.vault.findUnique({
        where: {
            id: Number(toname)
        }
    })

    const editedfromvault = await prisma.vault.update({
        where: {
            id: Number(fromname)
        },
        data: {
            value: Number(fromvault.value) - Number(amount),
        }
    })
    const editedtovault = await prisma.vault.update({
        where: {
            id: Number(toname)
        },
        data: {
            value: Number(tovault.value) + Number(amount),
        }
    })
    const newtrans = await prisma.transaction.create({
        data: {
            fromid: Number(fromvault.id),
            toid: Number(tovault.id),
            fromname: fromvault.name,
            toname: tovault.name,
            bprice1: tovault.value,
            bprice2: fromvault.value,
            aprice1: editedtovault.value,
            aprice2: editedfromvault.value,
            amount: Number(amount),
            time: new Date(date),
            refid: refid.toString()
        }
    })
    res.status(200).json({ "status": 200, tovault, fromvault, editedfromvault, editedtovault, newtrans })
})
app.post('/edittransaction', async (req, res) => {
    const { newdata, transfromname, transtoname, transval, date, refid } = req.body
    console.log(req.body)
    const fromvault = await prisma.vault.findMany({
        where: {
            name: transfromname
        }
    })
    const tovault = await prisma.vault.findMany({
        where: {
            name: transtoname
        }
    })

    console.log(fromvault, tovault)
    const editedfromvault = await prisma.vault.update({
        where: {
            id: fromvault[0].id
        },
        data: {
            value: (Number(fromvault[0].value) + Number(newdata.amount)) - Number(transval),
        }
    })
    const editedtovault = await prisma.vault.update({
        where: {
            id: tovault[0].id
        },
        data: {
            value: (Number(tovault[0].value) - Number(newdata.amount)) + Number(transval),
        }
    })
    console.log(editedfromvault, editedtovault)
    const editedtrans = await prisma.transaction.update({
        where: {
            id: Number(newdata.id)
        },
        data: {
            fromid: Number(fromvault[0].id),
            toid: Number(tovault[0].id),
            fromname: fromvault[0].name,
            toname: tovault[0].name,
            aprice1: Number(newdata.bprice1) + Number(transval),
            aprice2: Number(newdata.bprice2) - Number(transval),
            amount: Number(transval),
            time: new Date(date),
            refid: refid.toString()
        }
    })
    res.status(200).json({ "status": 200, editedtrans })
})
app.post('/deletetransaction', async (req, res) => {
    const { id } = req.body
    console.log(req.body)
    const trans = await prisma.transaction.findUnique({
        where: {
            id: id
        }
    })
    const fromvault = await prisma.vault.findUnique({
        where: {
            id: trans.fromid
        }
    })
    const tovault = await prisma.vault.findUnique({
        where: {
            id: trans.toid
        }
    })
    const editedfromvault = await prisma.vault.update({
        where: {
            id: fromvault.id
        },
        data: {
            value: Number(fromvault.value) + Number(trans.amount),
        }
    })
    const editedtovault = await prisma.vault.update({
        where: {
            id: tovault.id
        },
        data: {
            value: Number(tovault.value) - Number(trans.amount),
        }
    })
    const editedtrans = await prisma.transaction.delete({
        where: {
            id: trans.id
        }
    })
    res.status(200).json({ "status": 200, editedtrans })
})
app.post('/addvaultclienttransaction', async (req, res) => {
    const { fromname, toname, amount, type, refid, time } = req.body
    console.log(req.body)
    const date = new Date(time)
    const transss = await prisma.clientvaulttransaction.findMany({
        where: {
            refid: refid
        }
    })
    if (transss.length > 0) {
        res.status(200).json({ "status": 400, "error": "refid is used", "field": "refid" })
        return
    }
    const fromvault = await prisma.vault.findMany({
        where: {
            name: fromname.toString()
        }
    })
    const toclient = await prisma.clients.findMany({
        where: {
            name: toname.toString()
        }
    })
    console.log({ fromvault, toclient })
    if (type == 'in') {
        const vaultapdate = await prisma.vault.update({
            where: {
                id: fromvault[0].id
            },
            data: {
                value: fromvault[0].value + Number(amount)
            }
        })
        const clientupdate = await prisma.clients.update({
            where: {
                id: toclient[0].id
            },
            data: {
                expense: toclient[0].expense + Number(amount)
            }
        })
        const newtrans = await prisma.clientvaulttransaction.create({
            data: {
                toid: toclient[0].id,
                toname: toclient[0].name,
                fromid: fromvault[0].id,
                fromname: fromvault[0].name,
                time: date,
                way: type,
                amount: Number(amount),
                refid: refid
            }
        })
        res.status(200).json({ "status": 200 })
    } else if (type == 'out') {
        const vaultapdate = await prisma.vault.update({
            where: {
                id: fromvault[0].id
            },
            data: {
                value: fromvault[0].value - Number(amount)
            }
        })
        const clientupdate = await prisma.clients.update({
            where: {
                id: toclient[0].id
            },
            data: {
                payment: toclient[0].payment + Number(amount)
            }
        })
        const newtrans = await prisma.clientvaulttransaction.create({
            data: {
                toid: toclient[0].id,
                toname: toclient[0].name,
                fromid: fromvault[0].id,
                fromname: fromvault[0].name,
                time: date,
                way: type,
                amount: Number(amount),
                refid: refid
            }
        })
        res.status(200).json({ "status": 200 })
    } else {
        res.status(404).json({ "status": 404 })

    }
})
app.post('/addclientmtransaction', async (req, res) => {
    const { fromname, toname, amount, type, refid, time, text } = req.body
    console.log(req.body)
    const date = new Date(time)
    const toclient = await prisma.clients.findMany({
        where: {
            name: toname.toString()
        }
    })
    console.log({ toclient })
    if (type == 'in') {
        const clientupdate = await prisma.clients.update({
            where: {
                id: toclient[0].id
            },
            data: {
                expense: toclient[0].expense + Number(amount)
            }
        })
        const newtrans = await prisma.clientm.create({
            data: {
                clientid: toclient[0].id,
                clientname: toclient[0].name,
                time: date,
                way: type,
                amount: Number(amount),
                refid: refid,
                text: text.toString()
            }
        })
        res.status(200).json({ "status": 200 })
    } else if (type == 'out') {
        const clientupdate = await prisma.clients.update({
            where: {
                id: toclient[0].id
            },
            data: {
                payment: toclient[0].payment + Number(amount)
            }
        })
        const newtrans = await prisma.clientm.create({
            data: {
                clientid: toclient[0].id,
                clientname: toclient[0].name,
                time: date,
                way: type,
                amount: Number(amount),
                refid: refid,
                text: 'fadsfsad'
            }
        })
        res.status(200).json({ "status": 200 })
    } else {
        res.status(404).json({ "status": 404 })

    }
})
app.post('/deletevaultclienttransaction', async (req, res) => {
    const { id } = req.body
    console.log(req.body)

    const transtobiginwith = await prisma.clientvaulttransaction.findUnique({
        where: {
            id: Number(id)
        }
    })
    const fromvault = await prisma.vault.findUnique({
        where: {
            id: transtobiginwith.fromid
        }
    })
    const toclient = await prisma.clients.findUnique({
        where: {
            id: transtobiginwith.toid
        }
    })
    const type = transtobiginwith.way
    if (type == 'in') {
        console.log('in')
        const editedfromvault = await prisma.vault.update({
            where: {
                id: fromvault.id
            },
            data: {
                value: Number(fromvault.value) - Number(transtobiginwith.amount),
            }
        })
        const editedclient = await prisma.clients.update({
            where: {
                id: toclient.id
            },
            data: {
                expense: Number(toclient.expense) - Number(transtobiginwith.amount),
            }
        })
        const deltrans = await prisma.clientvaulttransaction.delete({
            where: {
                id: transtobiginwith.id
            }
        })
        res.status(200).json({ "status": 200 })
    } else if (type == 'out') {
        const editedfromvault = await prisma.vault.update({
            where: {
                id: fromvault.id
            },
            data: {
                value: Number(fromvault.value) + Number(transtobiginwith.amount),
            }
        })
        const editedclient = await prisma.clients.update({
            where: {
                id: toclient.id
            },
            data: {
                payment: Number(toclient.payment) - Number(transtobiginwith.amount),
            }
        })
        const deltrans = await prisma.clientvaulttransaction.delete({
            where: {
                id: transtobiginwith.id
            }
        })

        res.status(200).json({ "status": 200 })
    } else {
        res.status(404).json({ "status": 404 })
    }
})
app.post('/deleteclientmtransaction', async (req, res) => {
    const { id } = req.body
    console.log(req.body)

    const transtobiginwith = await prisma.clientm.findUnique({
        where: {
            id: Number(id)
        }
    })
    const toclient = await prisma.clients.findUnique({
        where: {
            id: transtobiginwith.clientid
        }
    })
    const type = transtobiginwith.way
    if (type == 'in') {
        console.log('in')
        const editedclient = await prisma.clients.update({
            where: {
                id: toclient.id
            },
            data: {
                expense: Number(toclient.expense) - Number(transtobiginwith.amount),
            }
        })
        const deltrans = await prisma.clientm.delete({
            where: {
                id: transtobiginwith.id
            }
        })
        res.status(200).json({ "status": 200 })
    } else if (type == 'out') {
        const editedclient = await prisma.clients.update({
            where: {
                id: toclient.id
            },
            data: {
                payment: Number(toclient.payment) - Number(transtobiginwith.amount),
            }
        })
        const deltrans = await prisma.clientm.delete({
            where: {
                id: transtobiginwith.id
            }
        })

        res.status(200).json({ "status": 200 })
    } else {
        res.status(404).json({ "status": 404 })
    }
})
app.post('/editvaultclienttransaction', async (req, res) => {
    const { fromname, toname, amount, type, refid, time, id } = req.body
    console.log('cvtrans edit req with data : ' + req.body)
    const date = new Date(time);
    const deltrans = await prisma.clientvaulttransaction.findUnique({
        where: {
            id: Number(id)
        }
    })
    const transss = await prisma.clientvaulttransaction.findMany({
        where: {
            refid: refid
        }
    })
    console.log(deltrans.refid, transss[0].refid)
    if (transss.length > 0 && transss[0].refid !== deltrans.refid) {
        res.status(200).json({ "status": 400, "error": "refid is used", "field": "refid" })
        return
    }
    const delfromvault = await prisma.vault.findUnique({
        where: {
            id: deltrans.fromid
        }
    })
    const deltoclient = await prisma.clients.findUnique({
        where: {
            id: deltrans.toid
        }
    })
    if (deltrans.way == 'in') {
        console.log('in')
        const editedfromvault = await prisma.vault.update({
            where: {
                id: delfromvault.id
            },
            data: {
                value: Number(delfromvault.value) - Number(deltrans.amount),
            }
        })
        const editedclient = await prisma.clients.update({
            where: {
                id: deltoclient.id
            },
            data: {
                expense: Number(deltoclient.expense) - Number(deltrans.amount),
            }
        })
        const deltransaction = await prisma.clientvaulttransaction.delete({
            where: {
                id: deltrans.id
            }
        })
    } else if (deltrans.way == 'out') {
        const editedfromvault = await prisma.vault.update({
            where: {
                id: delfromvault.id
            },
            data: {
                value: Number(delfromvault.value) + Number(deltrans.amount),
            }
        })
        const editedclient = await prisma.clients.update({
            where: {
                id: deltoclient.id
            },
            data: {
                payment: Number(deltoclient.payment) - Number(deltrans.amount),
            }
        })
        const deltransaction = await prisma.clientvaulttransaction.delete({
            where: {
                id: deltrans.id
            }
        })

    } else {
        res.status(404).json({ "status": 404 })
    }




    const fromvault = await prisma.vault.findMany({
        where: {
            name: fromname.toString()
        }
    })
    const toclient = await prisma.clients.findMany({
        where: {
            name: toname.toString()
        }
    })
    console.log({ fromvault, toclient })
    if (type == 'in') {
        const vaultapdate = await prisma.vault.update({
            where: {
                id: fromvault[0].id
            },
            data: {
                value: fromvault[0].value + Number(amount)
            }
        })
        const clientupdate = await prisma.clients.update({
            where: {
                id: toclient[0].id
            },
            data: {
                expense: toclient[0].expense + Number(amount)
            }
        })
        const newtrans = await prisma.clientvaulttransaction.create({
            data: {
                toid: toclient[0].id,
                toname: toclient[0].name,
                fromid: fromvault[0].id,
                fromname: fromvault[0].name,
                time: date,
                way: type,
                amount: Number(amount),
                refid: refid
            }
        })

    } else if (type == 'out') {
        const vaultapdate = await prisma.vault.update({
            where: {
                id: fromvault[0].id
            },
            data: {
                value: fromvault[0].value - Number(amount)
            }
        })
        const clientupdate = await prisma.clients.update({
            where: {
                id: toclient[0].id
            },
            data: {
                payment: toclient[0].payment + Number(amount)
            }
        })
        const newtrans = await prisma.clientvaulttransaction.create({
            data: {
                toid: toclient[0].id,
                toname: toclient[0].name,
                fromid: fromvault[0].id,
                fromname: fromvault[0].name,
                time: date,
                way: type,
                amount: Number(amount),
                refid: refid
            }
        })
    } else {
        res.status(404).json({ "status": 404 })
    }



    res.status(200).json({ "status": 200 })
})


app.post('/editclientmtransaction', async (req, res) => {
    const { clientname, amount, type, refid, time, id, text } = req.body
    console.log(req.body)
    const date = new Date(time);
    const deltrans = await prisma.clientm.findUnique({
        where: {
            id: Number(id)
        }
    })
    const deltoclient = await prisma.clients.findUnique({
        where: {
            id: deltrans.clientid
        }
    })
    console.log(type)
    if (deltrans.way == 'out') {
        console.log('out')
        const editedclient = await prisma.clients.update({
            where: {
                id: deltoclient.id
            },
            data: {
                payment: Number(deltoclient.payment) - Number(deltrans.amount),
            }
        })
        const deltransaction = await prisma.clientm.delete({
            where: {
                id: deltrans.id
            }
        })
    } else if (deltrans.way == 'in') {
        const editedclient = await prisma.clients.update({
            where: {
                id: deltoclient.id
            },
            data: {
                expense: Number(deltoclient.expense) - Number(deltrans.amount),
            }
        })
        const finaldeltrans = await prisma.clientm.delete({
            where: {
                id: deltrans.id
            }
        })
    } else {
        console.log('error while deleting')
        res.status(404).json({ "status": 404 })
    }



    const toclient = await prisma.clients.findMany({
        where: {
            name: clientname.toString()
        }
    })
    console.log({ toclient })
    if (type == 'in') {
        const clientupdate = await prisma.clients.update({
            where: {
                id: toclient[0].id
            },
            data: {
                expense: toclient[0].expense + Number(amount)
            }
        })
        console.log('ssss expense')

        const newtrans = await prisma.clientm.create({
            data: {
                clientid: toclient[0].id,
                clientname: toclient[0].name,
                time: date,
                way: type,
                amount: Number(amount),
                refid: refid,
                text: text.toString()
            }
        })

    } else if (type == 'out') {
        const clientupdate = await prisma.clients.update({
            where: {
                id: toclient[0].id
            },
            data: {
                payment: toclient[0].payment + Number(amount)
            }
        })
        console.log('ssss payment')
        const newtrans = await prisma.clientm.create({
            data: {
                clientid: toclient[0].id,
                clientname: toclient[0].name,
                time: date,
                way: type,
                amount: Number(amount),
                refid: refid,
                text: text.toString()
            }
        })
    } else {
        res.status(404).json({ "status": 404 })
    }

    wtransaction

    res.status(200).json({ "status": 200 })
})
app.post('/searchrefidvaultclienttransaction', async (req, res) => {
    const { refid } = req.body;
    console.log('cvtrans refid search request : ' + refid)
    const transaction = await prisma.clientvaulttransaction.findMany({
        where: {
            refid: refid.toString()
        }
    })
    res.json({ 'status': 200, transaction })
})
app.post('/searchrefidworkertransaction', async (req, res) => {
    const { refid } = req.body;
    console.log('wtrans refid search request : ' + refid)
    const transaction = await prisma.wtransaction.findMany({
        where: {
            refid: refid.toString()
        }
    })
    res.json({ 'status': 200, transaction })
})
// app.post('/editvault', async (req, res) => {
//     const { name, value, code, selid } = req.body
//     console.log(req.body)
//     const editedvault = await prisma.vault.update({
//         where: {
//             id: Number(selid)
//         },
//         data: {
//             code: Number(code),
//             name: name,
//             value: Number(value),
//         }
//     })
//     res.status(200).json({ "status": 200, editedvault })
// })

// app.post('/searchvault', async (req, res) => {
//     const { searchtext } = req.body
//     console.log(searchtext)
//     const foundproduts = await prisma.vault.findMany({
//         where: {
//             name: {
//                 contains: searchtext
//             }
//         }
//     })





app.get('/moneyownertransactions', async (req, res) => {
    console.log('transaction request')
    const transaction = await prisma.mtransaction.findMany({
    })
    res.json({ 'status': 200, transaction })
})
app.post('/addmoneyownertransactions', async (req, res) => {
    const { fromname, toname, amount, refid, time, way } = req.body
    console.log('money owner transaction with id of : ' + refid + ' and name of : ' + fromname + ' to vault : ' + toname + ' with amount of : ' + amount + ' time of : ' + time)
    console.log(req.body)
    const date = new Date(time)
    const fromvault = await prisma.moneyowner.findMany({
        where: {
            name: fromname.toString()
        }
    })
    const tovault = await prisma.vault.findMany({
        where: {
            name: toname.toString()
        }
    })
    if (way == 'in') {
        const editedfromvault = await prisma.moneyowner.update({
            where: {
                id: Number(fromvault[0].id)
            },
            data: {
                payment: Number(fromvault[0].payment) + Number(amount),
            }
        })
        const editedtovault = await prisma.vault.update({
            where: {
                id: Number(tovault[0].id)
            },
            data: {
                value: Number(tovault[0].value) + Number(amount),
            }
        })
        const newtrans = await prisma.mtransaction.create({
            data: {
                fromid: Number(fromvault[0].id),
                toid: Number(tovault[0].id),
                fromname: fromvault[0].name,
                toname: tovault[0].name,
                bprice1: tovault[0].value,
                bprice2: fromvault[0].value,
                aprice1: editedtovault.value,
                aprice2: editedfromvault.value,
                amount: Number(amount),
                refid: refid.toString(),
                time: date,
                way: 'in'
            }
        })
    } else if (way == 'out') {
        const editedfromvault = await prisma.moneyowner.update({
            where: {
                id: Number(fromvault[0].id)
            },
            data: {
                payed: Number(fromvault[0].payed) + Number(amount),
            }
        })
        const editedtovault = await prisma.vault.update({
            where: {
                id: Number(tovault[0].id)
            },
            data: {
                value: Number(tovault[0].value) - Number(amount),
            }
        })
        const newtrans = await prisma.mtransaction.create({
            data: {
                fromid: Number(fromvault[0].id),
                toid: Number(tovault[0].id),
                fromname: fromvault[0].name,
                toname: tovault[0].name,
                bprice1: tovault[0].value,
                bprice2: fromvault[0].value,
                aprice1: editedtovault.value,
                aprice2: editedfromvault.value,
                amount: Number(amount),
                refid: refid.toString(),
                time: date,
                way: 'out'
            }
        })
    } else {
        res.status(200).json({ "status": 400 })
    }
    res.status(200).json({ "status": 200 })
})
app.post('/editmoneyownertransactions', async (req, res) => {
    const { newdata, transfromname, transtoname, transval, editrefid, edittransdate, way } = req.body
    console.log(req.body)
    const id = newdata.id
    const trans = await prisma.mtransaction.findUnique({
        where: {
            id: id
        }
    })
    if (way == '' || !transfromname || !transtoname || !transval || !trans) {
        res.status(200).json({ "status": 400 })
        return
    }
    if (trans.way == 'in') {
        const oldfromvault = await prisma.moneyowner.findUnique({
            where: {
                id: trans.fromid
            }
        })
        const oldtovault = await prisma.vault.findUnique({
            where: {
                id: trans.toid
            }
        })
        const editedfromvault = await prisma.moneyowner.update({
            where: {
                id: oldfromvault.id
            },
            data: {
                payment: oldfromvault.payment - Number(trans.amount),
            }
        })
        const editedtovault = await prisma.vault.update({
            where: {
                id: oldtovault.id
            },
            data: {
                value: oldtovault.value - trans.amount,
            }
        })





    } else if (trans.way == 'out') {
        const oldfromvault = await prisma.moneyowner.findUnique({
            where: {
                id: trans.fromid
            }
        })
        const oldtovault = await prisma.vault.findUnique({
            where: {
                id: trans.toid
            }
        })
        const editedfromvault = await prisma.moneyowner.update({
            where: {
                id: oldfromvault.id
            },
            data: {
                payed: oldfromvault.payed - Number(trans.amount),
            }
        })
        const editedtovault = await prisma.vault.update({
            where: {
                id: oldtovault.id
            },
            data: {
                value: oldtovault.value + trans.amount,
            }
        })
    }
    const deleted = await prisma.mtransaction.delete({
        where: {
            id: Number(trans.id)
        }
    })

    console.log('deleted mtrans with id of ' + id)

    const date = new Date(edittransdate)
    const fromvault = await prisma.moneyowner.findMany({
        where: {
            name: transfromname.toString()
        }
    })
    const tovault = await prisma.vault.findMany({
        where: {
            name: transtoname.toString()
        }
    })
    if (way == 'in') {
        const editedfromvault = await prisma.moneyowner.update({
            where: {
                id: Number(fromvault[0].id)
            },
            data: {
                payment: Number(fromvault[0].payment) + Number(transval),
            }
        })
        const editedtovault = await prisma.vault.update({
            where: {
                id: Number(tovault[0].id)
            },
            data: {
                value: Number(tovault[0].value) + Number(transval),
            }
        })
        const newtrans = await prisma.mtransaction.create({
            data: {
                id: id,
                fromid: Number(fromvault[0].id),
                toid: Number(tovault[0].id),
                fromname: fromvault[0].name,
                toname: tovault[0].name,
                bprice1: tovault[0].value,
                bprice2: fromvault[0].value,
                aprice1: editedtovault.value,
                aprice2: editedfromvault.value,
                amount: Number(transval),
                refid: editrefid.toString(),
                time: date,
                way: 'in'
            }
        })
    } else if (way == 'out') {
        const editedfromvault = await prisma.moneyowner.update({
            where: {
                id: Number(fromvault[0].id)
            },
            data: {
                payed: Number(fromvault[0].payed) + Number(transval),
            }
        })
        const editedtovault = await prisma.vault.update({
            where: {
                id: Number(tovault[0].id)
            },
            data: {
                value: Number(tovault[0].value) - Number(transval),
            }
        })
        const newtrans = await prisma.mtransaction.create({
            data: {
                id: id,
                fromid: Number(fromvault[0].id),
                toid: Number(tovault[0].id),
                fromname: fromvault[0].name,
                toname: tovault[0].name,
                bprice1: tovault[0].value,
                bprice2: fromvault[0].value,
                aprice1: editedtovault.value,
                aprice2: editedfromvault.value,
                amount: Number(transval),
                refid: editrefid.toString(),
                time: date,
                way: 'out'
            }
        })
    } else {
        res.status(200).json({ "status": 400 })
        return
    }
    res.status(200).json({ "status": 200 })
})
app.post('/deletemoneyownertransactions', async (req, res) => {
    const { selectedRows } = req.body
    for (let index = 0; index < selectedRows.length; index++) {
        const element = selectedRows[index];

        const fromvault = await prisma.moneyowner.findUnique({
            where: {
                id: Number(element.fromid)
            }
        })
        const tovault = await prisma.vault.findUnique({
            where: {
                id: Number(element.toid)
            }
        })



        const editedfromvault = await prisma.moneyowner.update({
            where: {
                id: Number(fromvault.id)
            },
            data: {
                value: Number(fromvault.value) + Number(element.amount),
            }
        })
        const editedtovault = await prisma.vault.update({
            where: {
                id: Number(tovault.id)
            },
            data: {
                value: Number(tovault.value) - Number(element.amount),
            }
        })
        const deleted = await prisma.mtransaction.delete({
            where: {
                id: Number(element.id)
            }
        })
    }
    res.status(200).json({ "status": 200 })
})
app.post('/deletemoneyownertransaction', async (req, res) => {
    const { id } = req.body

    const trans = await prisma.mtransaction.findUnique({
        where: {
            id: id
        }
    })
    if (trans.way == 'in') {
        const oldfromvault = await prisma.moneyowner.findUnique({
            where: {
                id: trans.fromid
            }
        })
        const oldtovault = await prisma.vault.findUnique({
            where: {
                id: trans.toid
            }
        })
        const editedfromvault = await prisma.moneyowner.update({
            where: {
                id: oldfromvault.id
            },
            data: {
                payment: oldfromvault.payment - Number(trans.amount),
            }
        })
        const editedtovault = await prisma.vault.update({
            where: {
                id: oldtovault.id
            },
            data: {
                value: oldtovault.value - trans.amount,
            }
        })





    } else if (trans.way == 'out') {
        const oldfromvault = await prisma.moneyowner.findUnique({
            where: {
                id: trans.fromid
            }
        })
        const oldtovault = await prisma.vault.findUnique({
            where: {
                id: trans.toid
            }
        })
        const editedfromvault = await prisma.moneyowner.update({
            where: {
                id: oldfromvault.id
            },
            data: {
                payed: oldfromvault.payed - Number(trans.amount),
            }
        })
        const editedtovault = await prisma.vault.update({
            where: {
                id: oldtovault.id
            },
            data: {
                value: oldtovault.value + trans.amount,
            }
        })
    }






    const deleted = await prisma.mtransaction.delete({
        where: {
            id: Number(trans.id)
        }
    })

    res.status(200).json({ "status": 200 })
})

console.log(new Date().toISOString())





app.get('/wtransaction', async (req, res) => {
    console.log('wtransaction request')
    const transaction = await prisma.wtransaction.findMany({
    })
    res.json({ 'status': 200, transaction })
})
app.post('/addwtransaction', async (req, res) => {
    const { fromname, toname, amount, date, refid } = req.body
    const invoicetime = new Date(date)
    console.log(req.body)
    const transss = await prisma.wtransaction.findMany({
        where: {
            refid: refid
        }
    })
    if (transss.length > 0) {
        res.status(200).json({ "status": 400, "error": "refid is used", "field": "refid" })
        return
    }
    const fromvault = await prisma.vault.findMany({
        where: {
            name: fromname
        }
    })
    const tovault = await prisma.workers.findMany({
        where: {
            name: toname
        }
    })

    const editedfromvault = await prisma.vault.update({
        where: {
            id: Number(fromvault[0].id)
        },
        data: {
            value: Number(fromvault[0].value) - Number(amount),
        }
    })
    const editedtovault = await prisma.workers.update({
        where: {
            id: Number(tovault[0].id)
        },
        data: {
            payed: Number(tovault[0].payed) + Number(amount),
        }
    })
    const newtrans = await prisma.wtransaction.create({
        data: {
            fromid: Number(fromvault[0].id),
            toid: Number(tovault[0].id),
            fromname: fromvault[0].name,
            toname: tovault[0].name,
            bprice1: tovault[0].payed,
            bprice2: fromvault[0].value,
            aprice1: editedtovault.payed,
            aprice2: editedfromvault.value,
            amount: Number(amount),
            time: invoicetime,
            refid: refid
        }
    })
    res.status(200).json({ "status": 200, tovault, fromvault, editedfromvault, editedtovault, newtrans })
})
app.post('/editwtransaction', async (req, res) => {
    const { newdata, transfromname, transtoname, transval, editrefid } = req.body
    console.log(req.body)
    const oldtrans = await prisma.wtransaction.findUnique({
        where: {
            id: newdata.id
        }
    })
    const others = await prisma.wtransaction.findMany({
        where: {
            refid: editrefid
        }
    })
    if (others.length > 0 && others[0].refid !== oldtrans.refid) {
        console.log('refid is used')
        res.status(200).json({ "status": 400, "error": "refid is used", "field": "refid" })
        return
    }
    const fromvault = await prisma.vault.findUnique({
        where: {
            id: newdata.fromid
        }
    })
    const tovault = await prisma.workers.findUnique({
        where: {
            id: newdata.toid
        }
    })

    console.log(fromvault, tovault)
    const editedfromvault = await prisma.vault.update({
        where: {
            id: fromvault.id
        },
        data: {
            value: (Number(fromvault.value) + Number(newdata.amount)),
        }
    })
    const editedtovault = await prisma.workers.update({
        where: {
            id: tovault.id
        },
        data: {
            payed: (Number(tovault.payed) - Number(newdata.amount)),
        }
    })
    console.log(editedfromvault, editedtovault)



    const newfromvault = await prisma.vault.findMany({
        where: {
            name: transfromname
        }
    })
    const newtovault = await prisma.workers.findMany({
        where: {
            name: transtoname
        }
    })


    const editednewfromvault = await prisma.vault.update({
        where: {
            id: newfromvault[0].id
        },
        data: {
            value: (Number(newfromvault[0].value) - Number(transval)),
        }
    })
    const editednewtovault = await prisma.workers.update({
        where: {
            id: newtovault[0].id
        },
        data: {
            payed: (Number(newtovault[0].payed) + Number(transval)),
        }
    })

    const editedtrans = await prisma.wtransaction.update({
        where: {
            id: Number(newdata.id)
        },
        data: {
            fromid: Number(editednewfromvault.id),
            toid: Number(editednewtovault.id),
            fromname: editednewfromvault.name,
            toname: editednewtovault.name,
            aprice1: Number(newdata.bprice1) + Number(transval),
            aprice2: Number(newdata.bprice2) - Number(transval),
            amount: Number(transval),
            refid: editrefid
        }
    })
    res.status(200).json({ "status": 200, editedtrans })
})
app.post('/delwtransaction', async (req, res) => {
    const { newdata } = req.body
    const trans = await prisma.wtransaction.findUnique({
        where: {
            id: newdata.id
        }
    })
    console.log(trans)
    const fromvault = await prisma.vault.findUnique({
        where: {
            id: trans.fromid
        }
    })
    const tovault = await prisma.workers.findUnique({
        where: {
            id: trans.toid
        }
    })
    const editedfromvault = await prisma.vault.update({
        where: {
            id: fromvault.id
        },
        data: {
            value: (Number(fromvault.value) + Number(trans.amount)),
        }
    })
    const editedtovault = await prisma.workers.update({
        where: {
            id: tovault.id
        },
        data: {
            payed: (Number(tovault.payed) - Number(trans.amount)),
        }
    })
    const deltrans = await prisma.wtransaction.delete({
        where: {
            id: trans.id
        }
    })
    res.status(200).json({ "status": 200 })
})







//expenses category











app.get('/expensescategory', async (req, res) => {
    console.log('product request')
    const expensescategorys = await prisma.expensescategory.findMany({
    })
    res.json({ 'status': 200, expensescategorys })
})
app.post('/addexpensescategory', async (req, res) => {
    const { code, name, value } = req.body
    const newclient = await prisma.expensescategory.create({
        data: {
            name: name,
        }
    })
    res.status(200).json({ "status": 200, newclient })
})
app.post('/editexpensescategory', async (req, res) => {
    const { name, selid } = req.body
    console.log(req.body)
    const editedexpensescategory = await prisma.expensescategory.update({
        where: {
            id: Number(selid)
        },
        data: {
            name: name,
        }
    })
    res.status(200).json({ "status": 200, editedexpensescategory })
})
app.post('/searchexpensescategory', async (req, res) => {
    const { searchtext } = req.body
    console.log(searchtext)
    const foundproduts = await prisma.expensescategory.findMany({
        where: {
            name: {
                contains: searchtext
            }
        }
    })

    res.status(200).json({ "status": 200, foundproduts })
})












//done
app.get('/expensescategory2', async (req, res) => {
    console.log('product request')
    const expensescategorys = await prisma.expensescategory2.findMany({
    })
    res.json({ 'status': 200, expensescategorys })
})
app.post('/addexpensescategory2', async (req, res) => {
    const { name, newsel } = req.body
    console.log(req.body)
    const selection = await prisma.expensescategory.findMany({
        where: {
            name: newsel
        }
    })
    console.log(selection)
    const newexpensecategory = await prisma.expensescategory2.create({
        data: {
            name: name,
            linkname: selection[0].name,
            linkid: selection[0].id
        }
    })
    res.status(200).json({ "status": 200, newexpensecategory })
})
app.post('/editexpensescategory2', async (req, res) => {
    const { name, newselid, sel } = req.body
    console.log(req.body)
    const selection = await prisma.expensescategory.findMany({
        where: {
            name: newselid
        }
    })
    console.log(selection)
    const editedexpensescategory = await prisma.expensescategory2.update({
        where: {
            id: Number(sel)
        },
        data: {
            name: name,
            linkname: newselid,
            linkid: selection[0].id
        }
    })
    res.status(200).json({ "status": 200, editedexpensescategory })
})
app.post('/searchexpensescategory2', async (req, res) => {
    const { searchtext } = req.body
    console.log(searchtext)
    const foundproduts = await prisma.expensescategory2.findMany({
        where: {
            name: {
                contains: searchtext
            }
        }
    })

    res.status(200).json({ "status": 200, foundproduts })
})
app.post('/searchexpensescategory2byname', async (req, res) => {
    const { searchtext } = req.body
    console.log(searchtext)
    const foundproduts = await prisma.expensescategory2.findMany({
        where: {
            linkname: searchtext
        }
    })

    res.status(200).json({ "status": 200, foundproduts })
})
app.get('/expenses', async (req, res) => {
    console.log('expenses request')
    const expenses = await prisma.expenses.findMany({
    })
    res.json({ 'status': 200, expenses })
})
app.post('/addexpenses', async (req, res) => {
    const { name, value, refid, sel1, sel2, vault, transdate } = req.body
    console.log(req.body)
    const date = new Date(transdate)
    const selection1 = await prisma.expensescategory.findMany({
        where: {
            name: sel1
        }
    })
    const selection2 = await prisma.expensescategory2.findMany({
        where: {
            name: sel2
        }
    })
    const selvault = await prisma.vault.findUnique({
        where: {
            id: Number(vault[0].id),
        }
    })
    const editedvault = await prisma.vault.update({
        where: {
            id: Number(selvault.id),
        },
        data: {
            value: selvault.value - Number(value)
        }
    })
    const newexpense = await prisma.expenses.create({
        data: {
            name: name,
            amount: Number(value),
            refid: refid.toString(),
            categeryname: selection1[0].name,
            categoryid: selection1[0].id,
            nestedcategoryid: selection2[0].id,
            nestedcategoryname: selection2[0].name,
            vaultname: selvault.name,
            vaultid: selvault.id,
            time: date
        }
    })
    console.log(selection1, selection2, newexpense, editedvault)

    res.status(200).json({ "status": 200 })
})
app.post('/editexpenses', async (req, res) => {
    const { name, expenses, code, secondvaultname, selected, esel1, esel2, edittransdate } = req.body
    console.log(req.body)


    const selvault = await prisma.vault.findUnique({
        where: {
            id: Number(selected.vaultid),
        }
    })
    const editedvault = await prisma.vault.update({
        where: {
            id: Number(selected.vaultid),
        },
        data: {
            value: selvault.value + Number(selected.amount)
        }
    })

    const sebewlvault = await prisma.vault.findMany({
        where: {
            name: secondvaultname,
        }
    })
    console.log({ sebewlvault })
    const editednewvault = await prisma.vault.update({
        where: {
            id: Number(sebewlvault[0].id),
        },
        data: {
            value: sebewlvault[0].value - Number(expenses)
        }
    })
    const firstsel = await prisma.expensescategory.findMany({
        where: {
            name: esel1.toString()
        }
    })
    const secondsel = await prisma.expensescategory2.findMany({
        where: {
            name: esel2.toString()
        }
    })
    const newexpense = await prisma.expenses.update({
        where: {
            id: Number(selected.id)
        },
        data: {
            name: name,
            amount: Number(expenses),
            refid: code.toString(),
            vaultname: editednewvault.name,
            vaultid: editednewvault.id,
            categeryname: firstsel[0].name,
            categoryid: firstsel[0].id,
            nestedcategoryid: secondsel[0].id,
            nestedcategoryname: secondsel[0].name,
            time: new Date(edittransdate)
        }
    })



    res.status(200).json({ "status": 200 })
})
app.post('/deleteexpenses', async (req, res) => {
    console.log('delete expenses request')
    const { data } = req.body
    console.log(data)
    for (let index = 0; index < data.length; index++) {
        const sel = data[index]
        const selvault = await prisma.vault.findUnique({
            where: {
                id: Number(sel.vaultid),
            }
        })
        const editedvault = await prisma.vault.update({
            where: {
                id: Number(sel.vaultid),
            },
            data: {
                value: selvault.value + Number(sel.amount)
            }
        })
        await prisma.expenses.delete({
            where: {
                id: sel.id
            }
        })
    }
    const expenses = await prisma.expenses.findMany({
    })
    res.json({ 'status': 200, expenses })
})
app.post('/editexpensescategory2', async (req, res) => {
    const { name, newselid, sel } = req.body
    console.log(req.body)
    const selection = await prisma.expensescategory.findMany({
        where: {
            name: newselid
        }
    })
    console.log(selection)
    const editedexpensescategory = await prisma.expensescategory2.update({
        where: {
            id: Number(sel)
        },
        data: {
            name: name,
            linkname: newselid,
            linkid: selection[0].id
        }
    })
    res.status(200).json({ "status": 200, editedexpensescategory })
})
app.post('/searchexpenses', async (req, res) => {
    const { searchtext } = req.body
    console.log(searchtext)
    const foundproduts = await prisma.expenses.findMany({
        where: {
            refid: searchtext.toString()
        }
    })

    res.status(200).json({ "status": 200, foundproduts })
})
app.post('/searchexpensesnames', async (req, res) => {
    const { searchtext } = req.body
    console.log(searchtext)
    const foundproduts = await prisma.expenses.findMany({
        where: {
            name: {
                contains: searchtext
            }
        }
    })

    res.status(200).json({ "status": 200, foundproduts })
})
app.post('/searchexpensescategoryes', async (req, res) => {
    const { searchtext } = req.body
    console.log(searchtext)
    const foundproduts = await prisma.expenses.findMany({
        where: {
            nestedcategoryname: {
                contains: searchtext
            }
        }
    })

    res.status(200).json({ "status": 200, foundproduts })
})














app.get('/productincome', async (req, res) => {
    console.log('expenses request')
    const productincome = await prisma.productincome.findMany({
    })
    res.json({ 'status': 200, productincome })
})
app.post('/addproductincome', async (req, res) => {
    const { amount, fromname, toname, refid, price, sel2 } = req.body
    console.log(req.body)
    const selection1 = await prisma.inventoryproducts.findMany({
        where: {
            name: toname
        }
    })
    const selection2 = await prisma.clients.findMany({
        where: {
            name: fromname
        }
    })
    const productupdate = await prisma.inventoryproducts.update({
        where: {
            id: Number(selection1[0].id)
        },
        data: {
            quantity: Number(selection1[0].quantity) + Number(amount)
        }
    })
    const clientupdate = await prisma.clients.update({
        where: {
            id: Number(selection2[0].id)
        },
        data: {
            expense: Number(selection2[0].expense) + Number(amount * price)
        }
    })
    const newimport = await prisma.productincome.create({
        data: {
            from: selection2[0].name,
            amount: Number(amount),
            remaining: Number(amount),
            fromid: selection2[0].id,
            toid: selection1[0].id,
            price: Number(price),
            to: selection1[0].name,
            totalprice: Number(amount * price)
        }
    })
    // const newhistory = await prisma.products.create({
    //     data: {
    //         from: selection2[0].name,
    //         amount: Number(amount),
    //         fromid: selection2[0].id,
    //         toid: selection1[0].id,
    //         price: Number(price),
    //         to: selection1[0].name,
    //         totalprice: Number(amount * price),
    //         invoiceid: newimport.id
    //     }
    // })
    console.log({ selection1, selection2, newimport, clientupdate, productupdate, newhistory })

    res.status(200).json({ "status": 200 })
})
app.post('/editproductincome', async (req, res) => {
    const { newdata, editamount, editclientname, editprice, editprodname } = req.body
    const selection1 = await prisma.inventoryproducts.findUnique({
        where: {
            id: Number(newdata.toid)
        }
    })
    const selection2 = await prisma.clients.findUnique({
        where: {
            id: Number(newdata.fromid)
        }
    })
    const productupdate = await prisma.inventoryproducts.update({
        where: {
            id: Number(selection1.id)
        },
        data: {
            quantity: Number(selection1.quantity) - Number(newdata.amount)
        }
    })
    const clientupdate = await prisma.clients.update({
        where: {
            id: Number(selection2.id)
        },
        data: {
            expense: Number(selection2.expense) - Number(newdata.totalprice)
        }
    })




    const selection11 = await prisma.inventoryproducts.findMany({
        where: {
            name: editprodname
        }
    })
    const selection22 = await prisma.clients.findMany({
        where: {
            name: editclientname
        }
    })
    const productupdate2 = await prisma.inventoryproducts.update({
        where: {
            id: Number(selection11[0].id)
        },
        data: {
            quantity: Number(selection11[0].quantity) + Number(editamount)
        }
    })
    const clientupdate2 = await prisma.clients.update({
        where: {
            id: Number(selection22[0].id)
        },
        data: {
            expense: Number(selection22[0].expense) + Number(editamount * editprice)
        }
    })
    const newimport = await prisma.productincome.update({
        where: {
            id: newdata.id
        },
        data: {
            from: selection22[0].name,
            amount: Number(editamount),
            remaining: Number(editamount),
            fromid: selection22[0].id,
            toid: selection11[0].id,
            price: Number(editprice),
            to: selection11[0].name,
            totalprice: Number(editamount * editprice)
        }
    })
    // const newhistory = await prisma.products.update({
    //     where: {
    //         invoiceid: newimport.id
    //     },
    //     data: {
    //         from: selection22[0].name,
    //         amount: Number(editamount),
    //         fromid: selection22[0].id,
    //         toid: selection11[0].id,
    //         price: Number(editprice),
    //         to: selection11[0].name,
    //         totalprice: Number(editamount * editprice)
    //     }
    // })
    res.status(200).json({ "status": 200 })
})



app.post('/addproductimport', async (req, res) => {
    const { rows, refid, client, time } = req.body
    const invoicetime = new Date(time)
    console.log(invoicetime)



    for (let index = 0; index < rows.length; index++) {
        const element = rows[index];

        const selection1 = await prisma.inventoryproducts.findMany({
            where: {
                name: element.to
            }
        })
        const selection2 = await prisma.clients.findMany({
            where: {
                name: element.from
            }
        })

        const productupdate = await prisma.inventoryproducts.update({
            where: {
                id: Number(selection1[0].id)
            },
            data: {
                quantity: Number(selection1[0].quantity) + Number(element.amount)
            }
        })
        const clientupdate = await prisma.clients.update({
            where: {
                id: Number(selection2[0].id)
            },
            data: {
                expense: Number(selection2[0].expense) + Number(element.totalprice)
            }
        })
        const newimport = await prisma.productincome.create({
            data: {
                from: selection2[0].name,
                amount: Number(element.amount),
                remaining: Number(element.amount),
                fromid: selection2[0].id,
                toid: selection1[0].id,
                price: Number(element.price),
                to: selection1[0].name,
                totalprice: Number(element.totalprice),
                refid: refid.toString(),
                time: invoicetime
            }
        })
        // const newhistory = await prisma.products.create({
        //     data: {
        //         from: selection2[0].name,
        //         amount: Number(element.amount),
        //         remaining: Number(element.amount),
        //         fromid: selection2[0].id,
        //         toid: selection1[0].id,
        //         price: Number(element.price),
        //         to: selection1[0].name,
        //         totalprice: Number(element.totalprice),
        //         invoiceid: newimport.id,
        //         refid: refid.toString(),
        //         time: invoicetime

        //     }
        // })
    }
    // console.log({ selection1, selection2, newimport, clientupdate, productupdate, newhistory })

    res.status(200).json({ "status": 200 })
})
app.post('/productimportrefid', async (req, res) => {
    const { refid } = req.body
    var used = false
    const newexport = await prisma.productincome.findMany({
        where: {
            refid: refid.toString()
        }
    })
    // const lots = await prisma.products.findMany({
    //     where: {
    //         refid: refid.toString()
    //     }
    // })
    // for (let index = 0; index < lots.length; index++) {
    //     const element = lots[index];
    //     const exports = await prisma.productoutcome.findMany({
    //         where: {
    //             lotid: element.id
    //         }
    //     })
    //     if (exports.length > 0) {
    //         used = true
    //         console.log('used at export invoices : ' + exports)
    //     }
    // }
    console.log({ refid, count: newexport.length, editing: newexport.length > 0, used: false })
    res.status(200).json({ "status": 200, rows: newexport, refid, count: newexport.length, editing: newexport.length > 0, used: false })
})
app.post('/deleteproductimport', async (req, res) => {
    const { refid } = req.body
    const imports = await prisma.productincome.findMany({
        where: {
            refid: refid.toString()
        }
    })
    for (let index = 0; index < imports.length; index++) {
        const element = imports[index];

        const selection1 = await prisma.inventoryproducts.findUnique({
            where: {
                id: element.toid
            }
        })
        const selection2 = await prisma.clients.findUnique({
            where: {
                id: element.fromid
            }
        })

        const productupdate = await prisma.inventoryproducts.update({
            where: {
                id: Number(selection1.id)
            },
            data: {
                quantity: Number(selection1.quantity) - Number(element.amount)
            }
        })
        const clientupdate = await prisma.clients.update({
            where: {
                id: Number(selection2.id)
            },
            data: {
                expense: Number(selection2.expense) - Number(element.totalprice)
            }
        })
        const newimport = await prisma.productincome.delete({
            where: {
                id: element.id
            }
        })
        // const newhistory = await prisma.products.deleteMany({
        //     where: {
        //         refid: refid.toString()
        //     }
        // })
    }
    // console.log({ selection1, selection2, newimport, clientupdate, productupdate, newhistory })

    res.status(200).json({ "status": 200 })
})
app.post('/editproductimport', async (req, res) => {
    const { rows, refid, client, time } = req.body
    const invoicetime = new Date(time)
    console.log(invoicetime, client)
    const imports = await prisma.productincome.findMany({
        where: {
            refid: refid.toString()
        }
    })
    const clientsel = await prisma.clients.findMany({
        where: {
            name: client
        }
    })
    // const lots = await prisma.products.findMany({
    //     where: {
    //         refid: refid.toString()
    //     }
    // })
    // for (let index = 0; index < lots.length; index++) {
    //     const element = lots[index];
    //     const exports = await prisma.productoutcome.findMany({
    //         where: {
    //             lotid: element.id
    //         }
    //     })
    //     if (exports.length > 0) {
    //         for (let i = 0; i < exports.length; i++) {
    //             const element = exports[i];
    //             const newautoexp = await prisma.autoproductexports.updateMany({
    //                 where: {
    //                     refid: element.refid
    //                 },
    //                 data: {
    //                     payed: true
    //                 }
    //             })
    //             const invprod = await prisma.inventoryproducts.findUnique({
    //                 where: {
    //                     id: element.productid
    //                 }
    //             })
    //             const newinvprod = await prisma.inventoryproducts.update({
    //                 where: {
    //                     id: invprod.id
    //                 },
    //                 data: {
    //                     quantity: invprod.quantity + element.amount
    //                 }
    //             })
    //             await prisma.productoutcome.delete({
    //                 where: {
    //                     id: element.id
    //                 }
    //             })
    //             console.log('reset for re export done!')
    //         }
    //         console.error('invoice is used')
    //     }
    // }
    console.log('move on')
    //delete and revert first
    for (let index = 0; index < imports.length; index++) {
        const element = imports[index];

        const selection1 = await prisma.inventoryproducts.findUnique({
            where: {
                id: element.toid
            }
        })
        const selection2 = await prisma.clients.findUnique({
            where: {
                id: element.fromid
            }
        })

        const productupdate = await prisma.inventoryproducts.update({
            where: {
                id: Number(selection1.id)
            },
            data: {
                quantity: Number(selection1.quantity) - Number(element.amount)
            }
        })
        const clientupdate = await prisma.clients.update({
            where: {
                id: Number(selection2.id)
            },
            data: {
                expense: Number(selection2.expense) - Number(element.totalprice)
            }
        })
        const newimport = await prisma.productincome.delete({
            where: {
                id: element.id
            }
        })
        // const newhistory = await prisma.products.deleteMany({
        //     where: {
        //         refid: refid.toString()
        //     }
        // })
        console.log('reset for re import done!')
    }
    // console.log({ selection1, selection2, newimport, clientupdate, productupdate, newhistory })




    //create everything again
    for (let index = 0; index < rows.length; index++) {
        const element = rows[index];

        const selection1 = await prisma.inventoryproducts.findMany({
            where: {
                name: element.to
            }
        })
        const selection2 = await prisma.clients.findMany({
            where: {
                name: client
            }
        })

        const productupdate = await prisma.inventoryproducts.update({
            where: {
                id: Number(selection1[0].id)
            },
            data: {
                quantity: Number(selection1[0].quantity) + Number(element.amount)
            }
        })
        const clientupdate = await prisma.clients.update({
            where: {
                id: Number(selection2[0].id)
            },
            data: {
                expense: Number(selection2[0].expense) + Number(element.totalprice)
            }
        })
        const newimport = await prisma.productincome.create({
            data: {
                from: selection2[0].name,
                amount: Number(element.amount),
                remaining: Number(element.amount),
                fromid: selection2[0].id,
                toid: selection1[0].id,
                price: Number(element.price),
                to: selection1[0].name,
                totalprice: Number(element.totalprice),
                refid: refid.toString(),
                time: invoicetime

            }
        })
        // const newhistory = await prisma.products.create({
        //     data: {
        //         from: selection2[0].name,
        //         amount: Number(element.amount),
        //         remaining: Number(element.amount),
        //         fromid: selection2[0].id,
        //         toid: selection1[0].id,
        //         price: Number(element.price),
        //         to: selection1[0].name,
        //         totalprice: Number(element.totalprice),
        //         invoiceid: newimport.id,
        //         refid: refid.toString(),
        //         time: invoicetime

        //     }
        // })
        console.log('creation of import done!')
    }











    // const autoexports = await prisma.autoproductexports.findMany({
    //     where: {
    //         payed: true
    //     }
    // })
    // console.log('need to re exp amount : ' + autoexports.length)
    // var newlot = []

    // for (let i = 0; i < autoexports.length; i++) {
    //     const element = autoexports[i];
    //     const lots = await prisma.products.findMany({
    //         where: {
    //             to: element.productname
    //         }
    //     })
    //     newlot = lots
    //     const product = await prisma.inventoryproducts.findMany({
    //         where: {
    //             name: element.productname
    //         }
    //     })
    //     const client = await prisma.clients.findMany({
    //         where: {
    //             name: element.clientname
    //         }
    //     })
    //     var sum = 0
    //     var average = []
    //     lots.forEach((v, i, arr) => {
    //         sum += v.remaining;
    //         average.push(v.price)
    //     })
    //     average = average.reduce((a, b) => a + b, 0) / average.length;
    //     console.log({ sum, average })
    //     const totalamount = sum
    //     console.log({ "evailable balance ": sum })
    //     if (rows.amount > totalamount) {
    //         console.log('not enough')
    //         res.status(400)
    //         return
    //     }
    //     var remaining = element.amount
    //     console.log('avail lots for re exp ' + lots.length)
    //     for (let index = 0; index < lots.length; index++) {
    //         const element = lots[index];
    //         const startremain = element.remaining
    //         var lotremain = element.remaining
    //         console.log({ "Start remaining amount for transaction": remaining, "Start available in lot": lotremain })
    //         if (lotremain < remaining) {
    //             console.log('lot is smaller ++++++++++++++++++++')
    //             remaining = remaining - lotremain
    //             lotremain = 0
    //         } else if (lotremain > remaining) {
    //             console.log('lot is bigger +++++++++++++++++++++')
    //             lotremain = lotremain - remaining
    //             remaining = 0
    //         } else if (lotremain == remaining) {
    //             console.log('lot is equal ++++++++++++++++++++++')
    //             remaining = remaining - lotremain
    //             lotremain = 0
    //         }
    //         const newlot = await prisma.products.update({
    //             where: {
    //                 id: element.id
    //             },
    //             data: {
    //                 remaining: lotremain,
    //                 remainigtotal: lotremain * element.price
    //             }
    //         })
    //         if (element.remaining - lotremain !== 0) {
    //             const newexp = await prisma.productoutcome.create({
    //                 data: {
    //                     amount: element.remaining - lotremain,
    //                     clientid: client[0].id,
    //                     lotid: element.id,
    //                     clientname: client[0].name,
    //                     price: Number(average),
    //                     payed: false,
    //                     productid: product[0].id,
    //                     productname: product[0].name,
    //                     totalprice: Number(average) * Number(element.remaining - lotremain),
    //                     payedamount: 0,
    //                     refid: refid.toString(),
    //                     remaining: element.remaining - lotremain,
    //                     time: new Date(time),
    //                     return: 0,
    //                     returnid: '0'
    //                 }
    //             })
    //         }
    //         console.log('created a new manual exp')
    //         const lotss = await prisma.products.findMany({
    //             where: {
    //                 toid: product[0].id
    //             }
    //         })
    //         let sum = 0
    //         lotss.forEach((v, i, arr) => {
    //             sum += v.remaining;
    //         })
    //         const newinvprod = await prisma.inventoryproducts.update({
    //             where: {
    //                 id: product[0].id
    //             },
    //             data: {
    //                 quantity: Number(sum)
    //             }
    //         })
    //         console.log({ "new inv": newinvprod.quantity, "magic num": (Number(startremain) - lotremain) })
    //         console.log({ "End remaining amount for transaction": remaining, "End available in lot": lotremain })
    //         console.log({ "s": startremain, "e": lotremain, "d": startremain - lotremain })
    //         console.log('cycle =================================================')
    //     }


    //     console.log({ refid, effected: newlot.length, lotscount: lots.length })
    // }

    // await prisma.autoproductexports.updateMany({
    //     where: {
    //         payed: true
    //     },
    //     data: {
    //         payed: false
    //     }
    // })
    res.status(200).json({ "status": 200 })
})





app.post('/addproductreturn', async (req, res) => {
    const { rows, refid, client, time } = req.body
    const invoicetime = new Date(time)
    console.log(invoicetime)



    for (let index = 0; index < rows.length; index++) {
        const element = rows[index];

        const selection1 = await prisma.inventoryproducts.findMany({
            where: {
                name: element.to
            }
        })
        const selection2 = await prisma.clients.findMany({
            where: {
                name: element.from
            }
        })

        const productupdate = await prisma.inventoryproducts.update({
            where: {
                id: Number(selection1[0].id)
            },
            data: {
                quantity: Number(selection1[0].quantity) + Number(element.amount)
            }
        })
        const clientupdate = await prisma.clients.update({
            where: {
                id: Number(selection2[0].id)
            },
            data: {
                expense: Number(selection2[0].expense) + Number(element.totalprice)
            }
        })
        const newimport = await prisma.productincome.create({
            data: {
                from: selection2[0].name,
                amount: Number(element.amount),
                remaining: Number(element.amount),
                fromid: selection2[0].id,
                toid: selection1[0].id,
                price: Number(element.price),
                to: selection1[0].name,
                totalprice: Number(element.totalprice),
                refid: refid.toString(),
                time: invoicetime
            }
        })
        // const newhistory = await prisma.products.create({
        //     data: {
        //         from: selection2[0].name,
        //         amount: Number(element.amount),
        //         remaining: Number(element.amount),
        //         fromid: selection2[0].id,
        //         toid: selection1[0].id,
        //         price: Number(element.price),
        //         to: selection1[0].name,
        //         totalprice: Number(element.totalprice),
        //         invoiceid: newimport.id,
        //         refid: refid.toString(),
        //         time: invoicetime

        //     }
        // })
    }
    // console.log({ selection1, selection2, newimport, clientupdate, productupdate, newhistory })

    res.status(200).json({ "status": 200 })
})
app.post('/productreturnrefid', async (req, res) => {
    const { refid } = req.body
    const newexport = await prisma.productincome.findMany({
        where: {
            refid: refid.toString()
        }
    })
    res.status(200).json({ "status": 200, rows: newexport })
})
app.post('/deleteproductreturn', async (req, res) => {
    const { refid } = req.body
    const imports = await prisma.productincome.findMany({
        where: {
            refid: refid.toString()
        }
    })
    for (let index = 0; index < imports.length; index++) {
        const element = imports[index];

        const selection1 = await prisma.inventoryproducts.findUnique({
            where: {
                id: element.toid
            }
        })
        const selection2 = await prisma.clients.findUnique({
            where: {
                id: element.fromid
            }
        })

        const productupdate = await prisma.inventoryproducts.update({
            where: {
                id: Number(selection1.id)
            },
            data: {
                quantity: Number(selection1.quantity) - Number(element.amount)
            }
        })
        const clientupdate = await prisma.clients.update({
            where: {
                id: Number(selection2.id)
            },
            data: {
                expense: Number(selection2.expense) - Number(element.totalprice)
            }
        })
        const newimport = await prisma.productincome.delete({
            where: {
                id: element.id
            }
        })
        // const newhistory = await prisma.products.deleteMany({
        //     where: {
        //         refid: refid.toString()
        //     }
        // })
    }
    // console.log({ selection1, selection2, newimport, clientupdate, productupdate, newhistory })

    res.status(200).json({ "status": 200 })
})
app.post('/editproductreturn', async (req, res) => {
    const { rows, refid, client, time } = req.body
    const invoicetime = new Date(time)
    console.log('product return with retid of ' + refid)
    console.log(invoicetime)
    const imports = await prisma.productincome.findMany({
        where: {
            refid: refid.toString()
        }
    })

    //delete and revert first
    for (let index = 0; index < imports.length; index++) {
        const element = imports[index];

        const selection1 = await prisma.inventoryproducts.findUnique({
            where: {
                id: element.toid
            }
        })
        const selection2 = await prisma.clients.findUnique({
            where: {
                id: element.fromid
            }
        })

        const productupdate = await prisma.inventoryproducts.update({
            where: {
                id: Number(selection1.id)
            },
            data: {
                quantity: Number(selection1.quantity) - Number(element.amount)
            }
        })
        const clientupdate = await prisma.clients.update({
            where: {
                id: Number(selection2.id)
            },
            data: {
                expense: Number(selection2.expense) - Number(element.totalprice)
            }
        })
        const newimport = await prisma.productincome.delete({
            where: {
                id: element.id
            }
        })
        // const newhistory = await prisma.products.deleteMany({
        //     where: {
        //         refid: refid.toString()
        //     }
        // })
    }
    // console.log({ selection1, selection2, newimport, clientupdate, productupdate, newhistory })




    //create everything again
    for (let index = 0; index < rows.length; index++) {
        const element = rows[index];

        const selection1 = await prisma.inventoryproducts.findMany({
            where: {
                name: element.to
            }
        })
        const selection2 = await prisma.clients.findMany({
            where: {
                name: element.from
            }
        })

        const productupdate = await prisma.inventoryproducts.update({
            where: {
                id: Number(selection1[0].id)
            },
            data: {
                quantity: Number(selection1[0].quantity) + Number(element.amount)
            }
        })
        const clientupdate = await prisma.clients.update({
            where: {
                id: Number(selection2[0].id)
            },
            data: {
                expense: Number(selection2[0].expense) + Number(element.totalprice)
            }
        })
        const newimport = await prisma.productincome.create({
            data: {
                from: selection2[0].name,
                amount: Number(element.amount),
                remaining: Number(element.amount),
                fromid: selection2[0].id,
                toid: selection1[0].id,
                price: Number(element.price),
                to: selection1[0].name,
                totalprice: Number(element.totalprice),
                refid: refid.toString(),
                time: invoicetime,
                type: 1
            }
        })
        // const newhistory = await prisma.products.create({
        //     data: {
        //         from: selection2[0].name,
        //         amount: Number(element.amount),
        //         remaining: Number(element.amount),
        //         fromid: selection2[0].id,
        //         toid: selection1[0].id,
        //         price: Number(element.price),
        //         to: selection1[0].name,
        //         totalprice: Number(element.totalprice),
        //         invoiceid: newimport.id,
        //         refid: refid.toString(),
        //         time: invoicetime,
        //         type: 1
        //     }
        // })
    }


    res.status(200).json({ "status": 200 })
})








app.get('/producthistory', async (req, res) => {
    console.log('expenses request')
    const products = await prisma.productincome.findMany({
    })
    res.json({ 'status': 200, products })
})
app.post('/searchproducthistoryexact', async (req, res) => {
    const { searchtext } = req.body
    console.log(searchtext)
    const foundproduts = await prisma.productincome.findMany({
        where: {
            to: searchtext
        }
    })
    const prod = await prisma.inventoryproducts.findMany({
        where: {
            name: searchtext
        }
    })
    var sum = 0
    sum = prod.length > 0 ? prod[0].quantity : 0
    const average = foundproduts.length > 0 ? foundproduts[foundproduts.length - 1].price : 0
    console.log(average)
    res.status(200).json({ "status": 200, foundproduts, sum, average })
})
app.post('/searchproducthistory', async (req, res) => {
    const { searchtext } = req.body
    console.log(searchtext)
    const foundproduts = await prisma.productincome.findMany({
        where: {
            to: {
                contains: searchtext
            }
        }
    })

    res.status(200).json({ "status": 200, foundproduts })
})
app.post('/searchproducthistoryexactbyclient', async (req, res) => {
    const { searchtext } = req.body
    console.log(searchtext)
    const foundproduts = await prisma.productincome.findMany({
        where: {
            from: searchtext
        }
    })

    res.status(200).json({ "status": 200, foundproduts })
})
app.post('/searchproducthistorybyclient', async (req, res) => {
    const { searchtext } = req.body
    console.log(searchtext)
    const foundproduts = await prisma.productincome.findMany({
        where: {
            from: {
                contains: searchtext
            }
        }
    })

    res.status(200).json({ "status": 200, foundproduts })
})
app.post('/searchproducthistorybyclientexact', async (req, res) => {
    const { searchtext, clientname } = req.body
    console.log(searchtext)
    const foundproduts = await prisma.productoutcome.findMany({
        where: {
            productname: searchtext,
            clientname: clientname
        }
    })

    res.status(200).json({ "status": 200, foundproduts })
})






app.get('/productoutcome', async (req, res) => {
    console.log('product request')
    const products = await prisma.productoutcome.findMany({
    })
    res.json({ 'status': 200, products })
})
app.post('/addproductoutcome', async (req, res) => {
    const { prodname, clientname, prodid, pricehistoryid, amount } = req.body
    const selection1 = await prisma.inventoryproducts.findUnique({
        where: {
            id: Number(prodid)
        }
    })
    console.log(req.body)
    // const selhistory = await prisma.products.findUnique({
    //     where: {
    //         id: Number(pricehistoryid)
    //     }
    // })
    const selclient = await prisma.clients.findMany({
        where: {
            name: clientname
        }
    })
    const editedinvprod = await prisma.inventoryproducts.update({
        where: {
            id: Number(prodid)
        },
        data: {
            quantity: selection1.quantity - Number(amount)
        }
    })
    // const edithistory = await prisma.products.update({
    //     where: {
    //         id: selhistory.id
    //     },
    //     data: {
    //         amount: selhistory.amount - Number(amount),
    //     }
    // })
    // const edithistoryagain = await prisma.products.update({
    //     where: {
    //         id: selhistory.id
    //     },
    //     data: {
    //         totalprice: edithistory.amount * edithistory.price,
    //     }
    // })
    const newexport = await prisma.productoutcome.create({
        data: {
            productid: selection1.id,
            totalprice: Number(amount * selhistory.price),
            clientid: selclient[0].id,
            price: selhistory.price,
            amount: Number(amount),
            remaining: Number(amount),
            payed: false,
            clientname: selclient[0].name,
            productname: selection1.name,

        }
    })
    console.log({ selection1, selclient, newexport, editedinvprod, edithistory, editedinvprod })

    res.status(200).json({ "status": 200 })
})
app.post('/searchproductoutcomeexact', async (req, res) => {
    const { searchtext } = req.body
    console.log(searchtext)
    const foundproduts = await prisma.productoutcome.findMany({
        where: {
            productname: searchtext
        }
    })

    res.status(200).json({ "status": 200, foundproduts })
})
app.post('/searchproductoutcome', async (req, res) => {
    const { searchtext } = req.body
    console.log(searchtext)
    const foundproduts = await prisma.productoutcome.findMany({
        where: {
            productname: {
                contains: searchtext
            }
        }
    })

    res.status(200).json({ "status": 200, foundproduts })
})
app.post('/searchproductoutcomeexactbyclient', async (req, res) => {
    const { searchtext } = req.body
    console.log(searchtext)
    const foundproduts = await prisma.productoutcome.findMany({
        where: {
            clientname: searchtext
        }
    })

    res.status(200).json({ "status": 200, foundproduts })
})
app.post('/searchproductoutcomebyclient', async (req, res) => {
    const { searchtext } = req.body
    console.log(searchtext)
    const foundproduts = await prisma.productoutcome.findMany({
        where: {
            clientname: {
                contains: searchtext
            }
        }
    })

    res.status(200).json({ "status": 200, foundproduts })
})
app.post('/addproductexport', async (req, res) => {
    const { rows, refid, client, time } = req.body
    const invoicetime = new Date(time)
    console.log(invoicetime)
    for (let index = 0; index < rows.length; index++) {
        const element = rows[index];




        const selection1 = await prisma.inventoryproducts.findUnique({
            where: {
                name: element.productname
            }
        })
        // const selhistory = await prisma.products.findUnique({
        //     where: {
        //         id: Number(element.id)
        //     }
        // })
        const selclient = await prisma.clients.findUnique({
            where: {
                name: client
            }
        })
        const editedinvprod = await prisma.inventoryproducts.update({
            where: {
                id: selection1.id
            },
            data: {
                quantity: selection1.quantity - Number(element.amount)
            }
        })
        // const edithistory = await prisma.products.update({
        //     where: {
        //         id: selhistory.id
        //     },
        //     data: {
        //         amount: selhistory.amount - Number(element.amount),
        //     }
        // })
        // const edithistoryagain = await prisma.products.update({
        //     where: {
        //         id: selhistory.id
        //     },
        //     data: {
        //         totalprice: edithistory.amount * edithistory.price,
        //     }
        // })
        const newexport = await prisma.productoutcome.create({
            data: {
                productid: selection1.id,
                totalprice: Number(Number(element.amount) * selhistory.price),
                clientid: selclient.id,
                price: selhistory.price,
                amount: Number(Number(element.amount)),
                remaining: Number(Number(element.amount)),
                payed: false,
                clientname: selclient.name,
                productname: selection1.name,
                lotid: 0,
                refid: refid.toString(),
                time: invoicetime

            }
        })
        console.log({ selclient, newexport, editedinvprod, edithistory, editedinvprod })



    }
    res.status(200).json({ "status": 200 })
})
app.post('/productexportrefid', async (req, res) => {
    const { refid } = req.body
    const newexport = await prisma.productoutcome.findMany({
        where: {
            refid: refid.toString()
        }
    })
    res.status(200).json({ "status": 200, rows: newexport })
})
app.post('/productexportreturnrefid', async (req, res) => {
    const { refid } = req.body
    const newexport = await prisma.productoutcome.findMany({
        where: {
            returnid: refid.toString()
        }
    })
    res.status(200).json({ "status": 200, rows: newexport })
})
app.post('/deleteproductexport', async (req, res) => {
    const { refid } = req.body
    console.log('product export delete request with refid of ' + refid)
    const data = await prisma.productoutcome.findMany({
        where: {
            refid: refid.toString()
        }
    })

    for (let index = 0; index < data.length; index++) {
        const element = data[index];

        const selection1 = await prisma.inventoryproducts.findUnique({
            where: {
                name: element.productname
            }
        })
        // const selhistory = await prisma.products.findUnique({
        //     where: {
        //         id: Number(element.lotid)
        //     }
        // })
        const selclient = await prisma.clients.findUnique({
            where: {
                name: element.clientname
            }
        })
        const editedinvprod = await prisma.inventoryproducts.update({
            where: {
                id: selection1.id
            },
            data: {
                quantity: selection1.quantity - Number(element.return)
            }
        })
        const editedinvprodagain = await prisma.inventoryproducts.update({
            where: {
                id: selection1.id
            },
            data: {
                quantity: editedinvprod.quantity + Number(element.amount)
            }
        })
        // const edithistory = await prisma.products.update({
        //     where: {
        //         id: selhistory.id
        //     },
        //     data: {
        //         remaining: selhistory.remaining - Number(element.return),
        //     }
        // })
        // const edithistoryagain = await prisma.products.update({
        //     where: {
        //         id: selhistory.id
        //     },
        //     data: {
        //         remaining: edithistory.remaining + Number(element.amount),
        //     }
        // })
        // const edithistoryagain2 = await prisma.products.update({
        //     where: {
        //         id: selhistory.id
        //     },
        //     data: {
        //         remainigtotal: edithistory.remaining * edithistory.price,
        //     }
        // })
        const deletxport = await prisma.productoutcome.delete({
            where: {
                id: element.id
            }
        })
    }
    res.status(200).json({ "status": 200 })
})
app.post('/editproductexport', async (req, res) => {
    const { rows, refid, client, time } = req.body
    const invoicetime = new Date(time)
    console.log(invoicetime)


    console.log('product export edit request with refid of ' + refid)
    const data = await prisma.productoutcome.findMany({
        where: {
            refid: refid.toString()
        }
    })

    console.log(data)
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        const selection1 = await prisma.inventoryproducts.findUnique({
            where: {
                name: element.productname
            }
        })
        // const selhistory = await prisma.products.findUnique({
        //     where: {
        //         id: Number(element.lotid ? element.lotid : element.id)
        //     }
        // })
        const selclient = await prisma.clients.findUnique({
            where: {
                name: element.clientname
            }
        })
        console.log({ 'product': selection1, 'client': selclient })
        const editedinvprod = await prisma.inventoryproducts.update({
            where: {
                id: selection1.id
            },
            data: {
                quantity: selection1.quantity - Number(element.return)
            }
        })
        const editedinvprodagain = await prisma.inventoryproducts.update({
            where: {
                id: selection1.id
            },
            data: {
                quantity: editedinvprod.quantity + Number(element.amount)
            }
        })
        // const edithistory = await prisma.products.update({
        //     where: {
        //         id: selhistory.id
        //     },
        //     data: {
        //         remaining: selhistory.remaining - Number(element.return),
        //     }
        // })
        // const edithistoryagain = await prisma.products.update({
        //     where: {
        //         id: selhistory.id
        //     },
        //     data: {
        //         remaining: edithistory.remaining + Number(element.amount),
        //     }
        // })
        // const edithistoryagain2 = await prisma.products.update({
        //     where: {
        //         id: selhistory.id
        //     },
        //     data: {
        //         remainigtotal: edithistory.remaining * edithistory.price,
        //     }
        // })
        const deletxport = await prisma.productoutcome.delete({
            where: {
                id: element.id
            }
        })
    }


    for (let index = 0; index < rows.length; index++) {
        const element = rows[index];

        const selection1 = await prisma.inventoryproducts.findUnique({
            where: {
                name: element.productname
            }
        })
        // const selhistory = await prisma.products.findUnique({
        //     where: {
        //         id: Number(element.lotid ? element.lotid : element.id)
        //     }
        // })
        const selclient = await prisma.clients.findUnique({
            where: {
                name: client
            }
        })
        const editedinvprod = await prisma.inventoryproducts.update({
            where: {
                id: selection1.id
            },
            data: {
                quantity: selection1.quantity - Number(element.amount) + Number(element.return)
            }
        })
        // const edithistory = await prisma.products.update({
        //     where: {
        //         id: selhistory.id
        //     },
        //     data: {
        //         remaining: selhistory.remaining - Number(element.amount) + Number(element.return),
        //     }
        // })
        // const edithistoryagain = await prisma.products.update({
        //     where: {
        //         id: selhistory.id
        //     },
        //     data: {
        //         remainigtotal: edithistory.remaining * edithistory.price,
        //     }
        // })
        const newexport = await prisma.productoutcome.create({
            data: {
                productid: selection1.id,
                totalprice: Number(element.amount * selhistory.price),
                clientid: selclient.id,
                price: selhistory.price,
                amount: Number(element.amount),
                remaining: Number(element.amount),
                payed: false,
                clientname: selclient.name,
                productname: selection1.name,
                lotid: selhistory.id,
                refid: refid.toString(),
                time: invoicetime,
                return: Number(element.return),
                returnid: element.returnid.toString()
            }
        })
        console.log({ selection1, selclient, newexport, editedinvprod, edithistory, editedinvprod })



    }

    res.status(200).json({ "status": 200 })
})
app.post('/editproductexportreturn', async (req, res) => {
    const { rows, refid, client, time } = req.body
    const invoicetime = new Date(time)
    console.log(invoicetime)


    console.log('product export return edit request with refid of ' + refid)
    console.log(req.body)
    const data = await prisma.productoutcome.findMany({
        where: {
            returnid: refid.toString()
        }
    })
    for (let index = 0; index < data.length; index++) {
        const element = data[index];

        const selection1 = await prisma.inventoryproducts.findUnique({
            where: {
                name: element.productname
            }
        })
        // const selhistory = await prisma.products.findUnique({
        //     where: {
        //         id: Number(element.lotid)
        //     }
        // })
        const selclient = await prisma.clients.findUnique({
            where: {
                name: element.clientname
            }
        })
        console.log({ product: selection1, client: selclient })
        const editedinvprod = await prisma.inventoryproducts.update({
            where: {
                id: selection1.id
            },
            data: {
                quantity: selection1.quantity - Number(element.return)
            }
        })
        // const edithistory = await prisma.products.update({
        //     where: {
        //         id: selhistory.id
        //     },
        //     data: {
        //         remaining: selhistory.remaining - Number(element.return),
        //     }
        // })
        // const edithistoryagain = await prisma.products.update({
        //     where: {
        //         id: selhistory.id
        //     },
        //     data: {
        //         remainigtotal: edithistory.remaining * edithistory.price,
        //     }
        // })
        const delexport = await prisma.productoutcome.update({
            where: {
                id: element.id
            },
            data: {
                return: 0,
                returnid: null
            }
        })
    }



    for (let index = 0; index < rows.length; index++) {
        const element = rows[index];
        console.log(rows)

        const selection1 = await prisma.inventoryproducts.findUnique({
            where: {
                name: element.productname
            }
        })
        const outcome = await prisma.productoutcome.findUnique({
            where: {
                id: Number(element.id)
            }
        })
        // const selhistory = await prisma.products.findUnique({
        //     where: {
        //         id: Number(outcome.lotid)
        //     }
        // })
        const selclient = await prisma.clients.findUnique({
            where: {
                name: client
            }
        })
        const editedinvprod = await prisma.inventoryproducts.update({
            where: {
                id: selection1.id
            },
            data: {
                quantity: selection1.quantity + Number(element.return)
            }
        })
        // const edithistory = await prisma.products.update({
        //     where: {
        //         id: selhistory.id
        //     },
        //     data: {
        //         remaining: selhistory.remaining + Number(element.return),
        //     }
        // })
        // const edithistoryagain = await prisma.products.update({
        //     where: {
        //         id: selhistory.id
        //     },
        //     data: {
        //         remainigtotal: edithistory.remaining * edithistory.price,
        //     }
        // })
        const newexport = await prisma.productoutcome.update({
            where: {
                id: Number(element.id)
            },
            data: {
                return: Number(element.return),
                returnid: refid
            }
        })
        console.log({ selection1, selclient, newexport, editedinvprod, edithistory, editedinvprod })



    }
    res.status(200).json({ "status": 200 })
})


//done
app.post('/deleteworkerpayment', async (req, res) => {
    console.log('delete worker payment request')
    const { deleteproduct } = req.body
    for (let index = 0; index < deleteproduct.length; index++) {
        const element = deleteproduct[index];
        console.log(element)
        const id = Number(element.id)
        const workerid = Number(element.workerid)
        const total = Number(element.remaining)
        await prisma.workerpayout.delete({
            where: {
                id: id
            }
        })
        const worker = await prisma.workers.findUnique({
            where: {
                id: workerid
            }
        })
        const updatedworker = await prisma.workers.update({
            where: {
                id: workerid
            },
            data: {
                payment: worker.payment - total
            }
        })
        console.log(updatedworker)
    }
    const workers = await prisma.workerpayout.findMany({
    })
    res.json({ 'status': 200, workers })
})
app.get('/workerspay', async (req, res) => {
    console.log('expenses request')
    const products = await prisma.workerpayout.findMany({
    })
    res.json({ 'status': 200, products })
})
app.post('/createworkerinvoice', async (req, res) => {
    console.log(req.body)
    const { workername, amount, price, total, nights, returns, date } = req.body
    const selection1 = await prisma.workers.findMany({
        where: {
            name: workername
        }
    })
    const newpayout = await prisma.workerpayout.create({
        data: {
            workerid: selection1[0].id,
            workername: selection1[0].name,
            totalprice: Number(total),
            price: Number(price),
            amount: Number(amount),
            payed: false,
            remaining: Number(total),
            return: Number(returns),
            nights: Number(nights),
            time: new Date(date)
        }
    })
    console.log(newpayout)

    const editedworker = await prisma.workers.update({
        where: {
            id: selection1[0].id
        },
        data: {
            payment: selection1[0].payment + Number(total)
        }
    })
    const workers = await prisma.workerpayout.findMany({
    })
    res.status(200).json({ "status": 200, workers, editedworker })
})
app.post('/editworkerinvoice', async (req, res) => {
    console.log(req.body)
    const { newdata, amount, price, total, selid, returns, nights, date } = req.body
    const selection1 = await prisma.workers.findUnique({
        where: {
            id: Number(newdata.workerid)
        }
    })
    const newpayout = await prisma.workerpayout.update({
        where: {
            id: Number(selid)
        },
        data: {
            workerid: selection1.id,
            workername: selection1.name,
            totalprice: Number(total),
            price: Number(price),
            amount: Number(amount),
            payed: false,
            remaining: Number(total) - Number(newdata.payedamount),
            return: Number(returns),
            nights: Number(nights),
            time: new Date(date)
        }
    })
    console.log(newpayout)

    const editedworker = await prisma.workers.update({
        where: {
            id: Number(newdata.workerid)
        },
        data: {
            payment: selection1.payment - Number(newdata.totalprice) + Number(total),
        }
    })
    const workers = await prisma.workerpayout.findMany({
    })
    console.log(selection1)
    res.status(200).json({ "status": 200, workers: workers })
})
app.post('/searchworkerspaysbynameexact', async (req, res) => {
    const { searchtext } = req.body
    console.log(searchtext)
    const foundproduts = await prisma.workerpayout.findMany({
        where: {
            workername: searchtext
        }
    })

    res.status(200).json({ "status": 200, foundproduts })
})
app.post('/searchworkerspaysbydateexact', async (req, res) => {
    const { searchtext } = req.body
    console.log(new Date(searchtext).setHours(24))
    const foundproduts = await prisma.workerpayout.findMany({
        where: {
            time: {
                gte: new Date(searchtext),
                lte: new Date(new Date(searchtext).setHours(24)),
            }
        }
    })

    res.status(200).json({ "status": 200, foundproduts })
})
app.post('/searchworkerspaysbyname', async (req, res) => {
    const { searchtext } = req.body
    console.log(searchtext)
    const foundproduts = await prisma.workerpayout.findMany({
        where: {
            workername: {
                contains: searchtext
            }
        }
    })

    res.status(200).json({ "status": 200, foundproduts })
})





app.get('/fridgeproducts', async (req, res) => {
    console.log('product request')
    const products = await prisma.fridgeproducts.findMany({
    })
    res.json({ 'status': 200, products })
})
app.post('/addfridgeproduct', async (req, res) => {
    const { code, name, selectmode, amount, price } = req.body
    var mesure = 0
    if (selectmode == 'unit') {
        mesure = 0
    } else
        if (selectmode == 'kg') {
            mesure = 1
        } else
            if (selectmode == 'M') {
                mesure = 2
            } else
                if (selectmode == 'm2') {
                    mesure = 3
                }


    console.log(mesure)
    const newproduct = await prisma.fridgeproducts.create({
        data: {
            name: name,
            wayofmesure: mesure,
            price: Number(price),
            quantity: Number(amount),
            net: Number(price) * Number(amount)
        }
    })
    res.status(200).json({ "status": 200, newproduct })
})
app.post('/editfridgeproduct', async (req, res) => {
    const { code, name, sel, selid, amount, price } = req.body
    var mesure = 0
    if (sel == 'unit') {
        mesure = 0
    } else
        if (sel == 'kg') {
            mesure = 1
        } else
            if (sel == 'M') {
                mesure = 2
            } else
                if (sel == 'm2') {
                    mesure = 3
                }

    console.log(mesure, req.body)
    const editedproduct = await prisma.fridgeproducts.update({
        where: {
            id: Number(selid)
        },
        data: {
            code: Number(code),
            name: name,
            wayofmesure: mesure,
            price: Number(price),
            quantity: Number(amount),
            net: Number(price) * Number(amount)
        }
    })
    res.status(200).json({ "status": 200, editedproduct })
})
app.post('/searchfridgeproduct', async (req, res) => {
    const { searchtext } = req.body
    console.log(searchtext)
    const foundproduts = await prisma.fridgeproducts.findMany({
        where: {
            name: {
                contains: searchtext
            }
        }
    })

    res.status(200).json({ "status": 200, foundproduts })
})
app.get('/fridgeincome', async (req, res) => {
    console.log('expenses request')
    const productincome = await prisma.fridgeproducts.findMany({
    })
    res.json({ 'status': 200, productincome })
})
app.post('/addfridgeincome', async (req, res) => {
    const { newdata, newamount, newexpenses, newloss, newtotal } = req.body
    console.log(req.body)
    const newoutcome = await prisma.productoutcome.update({
        where: {
            id: Number(newdata.id)
        },
        data: {
            remaining: Number(newdata.remaining - Number(newexpenses)),
        }
    })
    const product = await prisma.inventoryproducts.findUnique({
        where: {
            id: newdata.productid
        }
    })
    console.log(product)
    const newhistory = await prisma.fridgeproducts.create({
        data: {
            from: newdata.clientname,
            fromid: Number(newdata.clientid),
            toid: Number(newdata.productid),
            to: newdata.productname,
            price: Number(newamount),
            totalprice: Number(newtotal),
            return: Number(newloss),
            remaining: Number(newdata.amount - Number(newexpenses)),
            amount: Number(newexpenses),
        }
    })
    console.log({ newhistory })

    res.status(200).json({ "status": 200 })
})






app.get('/productlinks', async (req, res) => {
    console.log('product link request')
    const links = await prisma.plink.findMany({
    })
    res.json({ 'status': 200, links })
})
app.post('/exportproduct', async (req, res) => {
    const { clientname, productname, amount } = req.body
    console.log(req.body)
    const availablelots = await prisma.products.findMany({
        where: {
            to: productname
        }
    })
    var sum = 0
    availablelots.forEach((v, i, arr) => {
        sum += v.amount;
    })
    const totalamount = sum
    console.log(sum)
    if (amount > totalamount) {
        res.status(200).json({ "status": 400 })
        return
    }
    var remaining = amount
    for (let index = 0; index < availablelots.length; index++) {
        const element = availablelots[index];
        var lotremain = element.amount
        console.log({ remaining, lotremain })
        if (lotremain < remaining) {
            console.log('am')
            remaining = remaining - lotremain
            lotremain = 0
        } else {
            console.log('lot')
            lotremain = lotremain - remaining
            remaining = 0
        }
        console.log('cycle')
        console.log({ remaining, lotremain })
    }
})
app.post('/linkproducts', async (req, res) => {
    const { bigproductname, smallproductname, amount } = req.body
    console.log(req.body)



    const selbprod = await prisma.inventoryproducts.findMany({
        where: {
            name: bigproductname.toString()
        }
    })
    const selsprod = await prisma.inventoryproducts.findMany({
        where: {
            name: smallproductname.toString()
        }
    })
    const newlink = await prisma.plink.create({
        data: {
            bigid: selbprod[0].id,
            bigname: selbprod[0].name,
            smallid: selsprod[0].id,
            smallname: selsprod[0].name,
            amount: Number(amount)
        }
    })
    console.log({ selbprod, selsprod })
    res.status(200).json({ "status": 200 })
})









app.post('/addfinalimport', async (req, res) => {
    const { rows, refid, client, time } = req.body
    const invoicetime = new Date(time)
    console.log(invoicetime)
    for (let index = 0; index < rows.length; index++) {
        const element = rows[index];
        const amount = Number(element.amount - element.return)
        const selection1 = await prisma.inventoryproducts.findMany({
            where: {
                name: element.to
            }
        })
        const selection2 = await prisma.clients.findMany({
            where: {
                name: element.from
            }
        })
        const linksel = await prisma.plink.findUnique({
            where: {
                bigid: selection1[0].id
            }
        })
        const secproduct = await prisma.inventoryproducts.findUnique({
            where: {
                id: linksel.smallid
            }
        })
        const updateclient = await prisma.clients.update({
            where: {
                id: selection2[0].id
            },
            data: {
                expense: Number(selection2[0].expense + element.totalprice)
            }
        })
        const newimport = await prisma.fridgeproducts.create({
            data: {
                from: selection2[0].name,
                amount: Number(element.amount),
                fromid: selection2[0].id,
                toid: selection1[0].id,
                price: Number(element.price),
                to: selection1[0].name,
                totalprice: Number(element.totalprice),
                refid: refid.toString(),
                time: invoicetime,
                remaining: amount,
                return: Number(element.return),
                managed: true
            }
        })

        const secimport = await prisma.fridgeproducts.create({
            data: {
                from: selection2[0].name,
                amount: Number(element.amount * linksel.amount),
                fromid: selection2[0].id,
                toid: secproduct.id,
                price: 0,
                to: secproduct.name,
                totalprice: 0,
                refid: refid.toString(),
                time: invoicetime,
                remaining: Number(amount * linksel.amount),
                return: Number(element.return * linksel.amount),
                managed: false
            }
        })
    }
    res.status(200).json({ "status": 200 })
})
app.post('/finalimportrefid', async (req, res) => {
    const { refid } = req.body
    const newexport = await prisma.fridgeproducts.findMany({
        where: {
            refid: refid.toString()
        }
    })
    console.log(newexport)
    res.status(200).json({ "status": 200, rows: newexport })
})
app.post('/finalimportdate', async (req, res) => {
    const { time } = req.body
    const invoicetime = new Date(time)
    const newexport = await prisma.fridgeproducts.findMany({
        where: {
            time: invoicetime
        }
    })
    console.log(newexport)
    res.status(200).json({ "status": 200, rows: newexport })
})
app.post('/deletefinalimport', async (req, res) => {
    const { refid } = req.body
    const imports = await prisma.fridgeproducts.findMany({
        where: {
            refid: refid.toString()
        }
    })

    console.log(imports)
    for (let index = 0; index < imports.length; index++) {
        const element = imports[index];
        const selection2 = await prisma.clients.findUnique({
            where: {
                id: element.fromid
            }
        })
        const updateclient = await prisma.clients.update({
            where: {
                id: selection2.id
            },
            data: {
                expense: Number(selection2.expense - element.totalprice)
            }
        })
        const newimport = await prisma.fridgeproducts.delete({
            where: {
                id: element.id
            }
        })
    }
    res.status(200).json({ "status": 200 })
})
app.post('/editfinalimport', async (req, res) => {
    const { rows, refid, client, time } = req.body
    const invoicetime = new Date(time)
    console.log(invoicetime)
    const imports = await prisma.fridgeproducts.findMany({
        where: {
            refid: refid.toString()
        }
    })
    console.log(imports)
    for (let index = 0; index < imports.length; index++) {
        const element = imports[index];
        const selection2 = await prisma.clients.findUnique({
            where: {
                id: element.fromid
            }
        })
        const updateclient = await prisma.clients.update({
            where: {
                id: selection2.id
            },
            data: {
                expense: Number(selection2.expense - element.totalprice)
            }
        })
        const newimport = await prisma.fridgeproducts.delete({
            where: {
                id: element.id
            }
        })
    }

    for (let index = 0; index < rows.length; index++) {
        const element = rows[index];
        const amount = Number(element.amount - element.return)
        const selection1 = await prisma.inventoryproducts.findMany({
            where: {
                name: element.to
            }
        })
        const selection2 = await prisma.clients.findMany({
            where: {
                name: element.from
            }
        })
        const linksel = await prisma.plink.findUnique({
            where: {
                bigid: selection1[0].id
            }
        })
        const updateclient = await prisma.clients.update({
            where: {
                id: selection2[0].id
            },
            data: {
                expense: Number(selection2[0].expense + element.totalprice)
            }
        })
        const newimport = await prisma.fridgeproducts.create({
            data: {
                from: selection2[0].name,
                amount: Number(element.amount),
                fromid: selection2[0].id,
                toid: selection1[0].id,
                price: Number(element.price),
                to: selection1[0].name,
                totalprice: Number(element.totalprice),
                refid: refid.toString(),
                time: invoicetime,
                remaining: amount,
                return: Number(element.return),
                managed: true
            }
        })
        if (linksel) {
            const secproduct = await prisma.inventoryproducts.findUnique({
                where: {
                    id: linksel.smallid
                }
            })
            const secimport = await prisma.fridgeproducts.create({
                data: {
                    from: selection2[0].name,
                    amount: Number(element.amount * linksel.amount),
                    fromid: selection2[0].id,
                    toid: secproduct.id,
                    price: 0,
                    to: secproduct.name,
                    totalprice: 0,
                    refid: refid.toString(),
                    time: invoicetime,
                    remaining: Number(amount * linksel.amount),
                    return: Number(element.return * linksel.amount),
                    managed: false
                }
            })
        }
    }
    res.status(200).json({ "status": 200 })
})








app.post('/autoexportproducts', async (req, res) => {
    const { rows, refid, clientname, time } = req.body


    const autoexports = await prisma.autoproductexports.findMany({
        where: {
            refid: refid.toString()
        }
    })

    for (let i = 0; i < autoexports.length; i++) {
        const element = autoexports[i];
        const prod = await prisma.inventoryproducts.findUnique({
            where: {
                id: element.productid
            }
        })
        const updprod = await prisma.inventoryproducts.update({
            where: {
                id: prod.id
            },
            data: {
                quantity: prod.quantity + element.amount
            }
        })
        await prisma.autoproductexports.delete({
            where: {
                id: element.id
            }
        })
    }


    for (let i = 0; i < rows.length; i++) {
        const element = rows[i];
        const product = await prisma.inventoryproducts.findMany({
            where: {
                name: element.productname
            }
        })
        const client = await prisma.clients.findMany({
            where: {
                name: clientname
            }
        })
        const newinvprod = await prisma.inventoryproducts.update({
            where: {
                id: product[0].id
            },
            data: {
                quantity: product[0].quantity - element.amount
            }
        })
        const newautoexp = await prisma.autoproductexports.create({
            data: {
                refid: refid.toString(),
                productid: product[0].id,
                clientid: client[0].id,
                productname: product[0].name,
                clientname: client[0].name,
                totalprice: Number(element.price) * Number(element.amount),
                price: Number(element.price),
                amount: Number(element.amount),
                return: 0,
                returnid: '0',
                remaining: Number(element.amount),
                payed: false,
                payedamount: 0,
                time: new Date(time),
            }
        })
    }


    res.status(200).json({ "status": 200 })
})

app.post('/autoproductexportrefid', async (req, res) => {
    const { refid } = req.body
    var used = false
    const newexport = await prisma.autoproductexports.findMany({
        where: {
            refid: refid.toString()
        }
    })
    console.log({ refid, count: newexport.length, editing: newexport.length > 0, used: false })
    res.status(200).json({ "status": 200, rows: newexport, refid, count: newexport.length, editing: newexport.length > 0, used: false })

})







app.post('/productimportrefid', async (req, res) => {
    const { refid } = req.body
    var used = false
    const newexport = await prisma.productincome.findMany({
        where: {
            refid: refid.toString()
        }
    })
    console.log({ refid, count: newexport.length, editing: newexport.length > 0, used: false })
    res.status(200).json({ "status": 200, rows: newexport, refid, count: newexport.length, editing: newexport.length > 0, used: false })
})




app.post('/autoproductexportdelete', async (req, res) => {
    const { refid } = req.body
    console.log("auto product export delete with refid of " + refid)
    const autoexports = await prisma.autoproductexports.findMany({
        where: {
            refid: refid.toString()
        }
    })

    for (let i = 0; i < autoexports.length; i++) {
        const element = autoexports[i];
        const invprod = await prisma.inventoryproducts.findUnique({
            where: {
                id: element.productid
            }
        })
        const newinvprod = await prisma.inventoryproducts.update({
            where: {
                id: invprod.id
            },
            data: {
                quantity: invprod.quantity + element.amount
            }
        })
        await prisma.autoproductexports.delete({
            where: {
                id: element.id
            }
        })
    }

    res.status(200).json({ "status": 200 })
})







app.post('/autoexportproductsreturn', async (req, res) => {
    const { rows, refid, client, time } = req.body
    const invoicetime = new Date(time)
    console.log('product export return edit with refid of : ' + refid)
    console.log(invoicetime)
    const imports = await prisma.productincome.findMany({
        where: {
            refid: refid.toString(),
            type: 1
        }
    })
    console.log('delete and revert first')
    //delete and revert first
    for (let index = 0; index < imports.length; index++) {
        const element = imports[index];

        const selection1 = await prisma.inventoryproducts.findUnique({
            where: {
                id: element.toid
            }
        })
        const productupdate = await prisma.inventoryproducts.update({
            where: {
                id: Number(selection1.id)
            },
            data: {
                quantity: Number(selection1.quantity) - Number(element.amount)
            }
        })
        const newimport = await prisma.productincome.delete({
            where: {
                id: element.invoiceid
            }
        })
    }

    console.log('create everything again')
    //create everything again
    for (let index = 0; index < rows.length; index++) {
        const element = rows[index];

        const selection1 = await prisma.inventoryproducts.findMany({
            where: {
                name: element.to
            }
        })
        const selection2 = await prisma.clients.findMany({
            where: {
                name: element.from
            }
        })

        const productupdate = await prisma.inventoryproducts.update({
            where: {
                id: Number(selection1[0].id)
            },
            data: {
                quantity: Number(selection1[0].quantity) + Number(element.amount)
            }
        })
        const newimport = await prisma.productincome.create({
            data: {
                from: selection2[0].name,
                amount: Number(element.amount),
                remaining: Number(element.amount),
                fromid: selection2[0].id,
                toid: selection1[0].id,
                price: Number(element.price),
                to: selection1[0].name,
                totalprice: Number(element.totalprice),
                refid: refid.toString(),
                time: invoicetime,
                type: 1
            }
        })
    }
    res.status(200).json({ "status": 200 })
})

app.post('/searchpout', async (req, res) => {
    const { searchtext, client } = req.body
    const foundproduts = await prisma.productoutcome.findMany({
        where: {
            clientname: client,
            productname: searchtext
        }
    })
    var sum = 0
    var average = []
    foundproduts.forEach((v, i, arr) => {
        sum += v.remaining;
        average.push(v.price)
    })
    average = average.reduce((a, b) => a + b, 0) / average.length;
    average = 10000
    console.log({ "status": 200, foundproduts, sum, average })
    res.status(200).json({ "status": 200, foundproduts, sum, average })
})


app.post('/searchlotsbyrefid', async (req, res) => {
    const { refid } = req.body
    const foundproduts = await prisma.productincome.findMany({
        where: {
            refid: refid.toString()
        }
    })
    console.log({ "status": 200, refid })
    res.status(200).json({ "status": 200, foundproduts })
})
app.post('/searchautoexportsbyrefid', async (req, res) => {
    const { refid } = req.body
    const foundproduts = await prisma.autoproductexports.findMany({
        where: {
            refid: refid.toString()
        }
    })
    console.log({ "status": 200, refid })
    res.status(200).json({ "status": 200, foundproduts })
})

app.post('/clientsummery', async (req, res) => {
    const { clientname } = req.body
    console.log('client summery request fro client : ' + clientname)
    const client = await prisma.clients.findMany({
        where: {
            name: clientname
        }
    })
    const exports = await prisma.autoproductexports.findMany({
        where: {
            clientid: client[0].id
        }
    })
    const imports = await prisma.fridgeproducts.findMany({
        where: {
            fromid: client[0].id
        }
    })
    const returns = await prisma.productincome.findMany({
        where: {
            type: 1,
            fromid: client[0].id
        }
    })


    var impsum = imports.reduce((acc, curr) => {
        const objInAcc = acc.find((o) => o.toid == curr.toid && o.to == curr.to);
        if (objInAcc) {
            objInAcc.amount += curr.amount;
            objInAcc.return += curr.return;
        }
        else acc.push(curr);
        return acc;
    }, []);


    var retsum = returns.reduce((acc, curr) => {
        const objInAcc = acc.find((o) => o.toid == curr.toid && o.to == curr.to);
        if (objInAcc) {
            objInAcc.amount += curr.amount;
            objInAcc.return += curr.return;
        }
        else acc.push(curr);
        return acc;
    }, []);
    retsum = retsum.map(({
        toid: productid,
        to: productname,
        from: clientname,
        ...rest
    }) => ({
        productid,
        productname,
        clientname,
        ...rest
    }));
    var importsum = impsum
    const expsum = exports.reduce((acc, curr) => {
        const objInAcc = acc.find((o) => o.productid == curr.productid && o.productname == curr.productname);
        if (objInAcc) {
            objInAcc.amount += curr.amount;
            objInAcc.return += curr.return;
        }
        else acc.push(curr);
        return acc;
    }, []);
    const exportsumedit = expsum.map(object => ({ ...object }))
    const exportsum = expsum.map(object => ({ ...object }))
    impsum = impsum.map(({
        toid: productid,
        to: productname,
        from: clientname,
        ...rest
    }) => ({
        productid,
        productname,
        clientname,
        ...rest
    }));

    importsum = importsum.map(({
        toid: productid,
        to: productname,
        from: clientname,
        ...rest
    }) => ({
        productid,
        productname,
        clientname,
        ...rest
    }));
    const newexpsum = exportsumedit.concat(retsum)

    const finalexpsum = newexpsum.reduce((acc, curr) => {
        const objInAcc = acc.find((o) => o.productid == curr.productid && o.productname == curr.productname);
        if (objInAcc) {
            objInAcc.amount -= curr.amount;
        }
        else acc.push(curr);
        return acc;
    }, []);

    const combined = finalexpsum.concat(impsum)


    const diff = combined.reduce((acc, curr) => {
        const objInAcc = acc.find((o) => o.productid == curr.productid && o.productname == curr.productname);
        if (objInAcc) {
            objInAcc.amount = (objInAcc.amount - objInAcc.return) - (curr.amount - curr.return);
        }
        else acc.push(curr);
        return acc;
    }, []);

    res.status(200).json({ "status": 200, retsum, client, imports, exports, importsum, exportsum, combined, diff })
})


app.post('/selfinalimportclient', async (req, res) => {
    const { clientname } = req.body
    console.log('client sel for final import with name : ' + clientname)
    const client = await prisma.clients.findMany({
        where: {
            name: clientname
        }
    })
    const exports = await prisma.autoproductexports.findMany({
        where: {
            clientid: client[0].id
        }
    })
    const imports = await prisma.fridgeproducts.findMany({
        where: {
            fromid: client[0].id
        }
    })



    var impsum = imports.reduce((acc, curr) => {
        const objInAcc = acc.find((o) => o.toid == curr.toid && o.to == curr.to);
        if (objInAcc) {
            objInAcc.amount += curr.amount;
            objInAcc.return += curr.return;
        }
        else acc.push(curr);
        return acc;
    }, []);
    var importsum = impsum
    const expsum = exports.reduce((acc, curr) => {
        const objInAcc = acc.find((o) => o.productid == curr.productid && o.productname == curr.productname);
        if (objInAcc) {
            objInAcc.amount += curr.amount;
            objInAcc.return += curr.return;
        }
        else acc.push(curr);
        return acc;
    }, []);
    const exportsum = expsum


    impsum = impsum.map(({
        toid: productid,
        to: productname,
        from: clientname,
        ...rest
    }) => ({
        productid,
        productname,
        clientname,
        ...rest
    }));

    importsum = importsum.map(({
        toid: productid,
        to: productname,
        from: clientname,
        ...rest
    }) => ({
        productid,
        productname,
        clientname,
        ...rest
    }));
    const combined = impsum.concat(expsum)

    const diff = combined.reduce((acc, curr) => {
        const objInAcc = acc.find((o) => o.productid == curr.productid && o.productname == curr.productname);
        if (objInAcc) {
            objInAcc.amount = objInAcc.amount - objInAcc.return - curr.amount - curr.return;
        }
        else acc.push(curr);
        return acc;
    }, []);
    res.status(200).json({ "status": 200, client, imports, exports, importsum, exportsum, combined, diff })
})
app.post('/editlot', async (req, res) => {
    const { lotid, newprice, newamount } = req.body
    console.log(req.body)
    const invoice = await prisma.productincome.findUnique({
        where: {
            id: lotid
        }
    })
    console.log({ invoice })
    const editinvoice = await prisma.productincome.update({
        where: {
            id: lotid
        },
        data: {
            price: Number(newprice),
            totalprice: Number(newprice * newamount),
            remainigtotal: Number(newprice * invoice.remainigtotal),
            amount: Number(newamount),
            remaining: invoice.remaining - invoice.amount + Number(newamount)
        }
    })

    // const exportedinvoices = await prisma.productoutcome.updateMany({
    //     where: {
    //         lotid: lot.id
    //     },
    //     data: {
    //         price: editlot.price
    //     }
    // })
    const client = await prisma.clients.findUnique({
        where: {
            id: invoice.fromid
        }
    })
    const clientupdate = await prisma.clients.update({
        where: {
            id: invoice.fromid
        },
        data: {
            expense: Number(client.expense) - Number(invoice.totalprice)
        }
    })
    const clientupdateagain = await prisma.clients.update({
        where: {
            id: invoice.fromid
        },
        data: {
            expense: Number(clientupdate.expense) + Number(editinvoice.price * editinvoice.amount)
        }
    })
    res.status(200).json({ "status": 200 })
})










app.get('/autoproductexportslist', async (req, res) => {
    console.log('expenses request')
    const products = await prisma.autoproductexports.findMany({
    })
    res.json({ 'status': 200, products })
})
app.post('/searchautoexportsexact', async (req, res) => {
    const { searchtext } = req.body
    console.log(searchtext)
    const foundproduts = await prisma.autoproductexports.findMany({
        where: {
            productname: searchtext
        }
    })
    var sum = 0
    var average = []
    foundproduts.forEach((v, i, arr) => {
        sum += v.remaining;
        average.push(v.price)
    })
    average = average.reduce((a, b) => a + b, 0) / average.length;
    console.log(average)
    res.status(200).json({ "status": 200, foundproduts, sum, average })
})
app.post('/searchautoexportsexactbyclient', async (req, res) => {
    const { searchtext } = req.body
    console.log(searchtext)
    const foundproduts = await prisma.autoproductexports.findMany({
        where: {
            clientname: searchtext
        }
    })

    res.status(200).json({ "status": 200, foundproduts })
})
app.post('/searchautoproductexportsbyclientexact', async (req, res) => {
    const { searchtext, clientname } = req.body
    console.log(searchtext)
    const foundproduts = await prisma.autoproductexports.findMany({
        where: {
            productname: searchtext,
            clientname: clientname
        }
    })

    res.status(200).json({ "status": 200, foundproduts })
})












app.get('/fridgelist', async (req, res) => {
    console.log('expenses request')
    const products = await prisma.fridgeproducts.findMany({
    })
    res.json({ 'status': 200, products })
})
app.post('/searchfridgeexact', async (req, res) => {
    const { searchtext } = req.body
    console.log(searchtext)
    const foundproduts = await prisma.fridgeproducts.findMany({
        where: {
            to: searchtext
        }
    })
    var sum = 0
    var average = []
    foundproduts.forEach((v, i, arr) => {
        sum += v.remaining;
        average.push(v.price)
    })
    average = average.reduce((a, b) => a + b, 0) / average.length;
    console.log(average)
    res.status(200).json({ "status": 200, foundproduts, sum, average })
})
app.post('/searchfridgebyclient', async (req, res) => {
    const { searchtext } = req.body
    console.log(searchtext)
    const foundproduts = await prisma.fridgeproducts.findMany({
        where: {
            from: searchtext
        }
    })

    res.status(200).json({ "status": 200, foundproduts })
})
app.post('/searchfridgebyrefid', async (req, res) => {
    const { refid } = req.body
    console.log(refid)
    const foundproduts = await prisma.fridgeproducts.findMany({
        where: {
            refid: refid
        }
    })

    res.status(200).json({ "status": 200, foundproduts })
})


const resetamounts = async () => {
    const lots = await prisma.autoproductexports.findMany({})
    for (let index = 0; index < lots.length; index++) {
        const ele = lots[index];







        const lots1 = await prisma.products.findMany({
            where: {
                to: ele.productname
            }
        })
        const product = await prisma.inventoryproducts.findMany({
            where: {
                name: ele.productname
            }
        })
        const client = await prisma.clients.findMany({
            where: {
                name: ele.clientname
            }
        })
        var sum = 0
        var average = []
        lots1.forEach((v, i, arr) => {
            sum += v.remaining;
            average.push(v.price)
        })
        average = average.reduce((a, b) => a + b, 0) / average.length;
        const totalamount = sum
        if (ele.amount > totalamount) {
            console.log('not enough')
            res.status(400)
            return
        }
        var remaining = ele.amount
        for (let index = 0; index < lots1.length; index++) {
            const element = lots1[index];
            const startremain = element.remaining
            var lotremain = element.remaining
            if (lotremain < remaining) {
                remaining = remaining - lotremain
                lotremain = 0
            } else if (lotremain > remaining) {
                lotremain = lotremain - remaining
                remaining = 0
            } else if (lotremain == remaining) {
                remaining = remaining - lotremain
                lotremain = 0
            }
            const newlot = await prisma.products.update({
                where: {
                    id: element.id
                },
                data: {
                    remaining: lotremain,
                    remainigtotal: lotremain * element.price
                }
            })
            if (element.remaining - lotremain !== 0) {
                const newexp = await prisma.productoutcome.create({
                    data: {
                        amount: element.remaining - lotremain,
                        clientid: client[0].id,
                        lotid: element.id,
                        clientname: client[0].name,
                        price: Number(average),
                        payed: false,
                        productid: product[0].id,
                        productname: product[0].name,
                        totalprice: Number(average) * Number(element.remaining - lotremain),
                        payedamount: 0,
                        refid: ele.refid,
                        remaining: element.remaining - lotremain,
                        time: element.time,
                        return: 0,
                        returnid: '0'
                    }
                })
            }
            const lotss = await prisma.products.findMany({
                where: {
                    toid: product[0].id
                }
            })
            let sum = 0
            lotss.forEach((v, i, arr) => {
                sum += v.remaining;
            })
            const newinvprod = await prisma.inventoryproducts.update({
                where: {
                    id: product[0].id
                },
                data: {
                    quantity: Number(sum)
                }
            })
        }





        console.log(ele.refid)
    }
}



app.post('/expensescheckrefid', async (req, res) => {
    const { refid } = req.body
    const expenses = await prisma.expenses.findMany({
        where: {
            refid: refid ? refid.toString() : ''
        }
    })
    console.log('exp refid check ' + refid + ' ' + expenses.length)
    const avail = expenses.length > 0
    res.status(200).json({ "status": 200, avail })
})











app.post('/vaultsummery', async (req, res) => {
    const { vaultname } = req.body
    console.log(vaultname)
    var vaultt = await prisma.vault.findMany({
        where: {
            name: vaultname
        }
    })
    var summeryarray = [];
    if (vaultt.length < 1) {
        res.status(200).json({ "status": 200, "error": "not found" })
        return
    }
    const vault = vaultt[0]
    // await prisma.vault.update({
    //     where: {
    //         id: vault.id
    //     },
    //     data: {
    //         value: 0
    //     }
    // })
    const ownertrans = await prisma.mtransaction.findMany({
        where: {
            toid: vault.id
        }
    })
    const clients = await prisma.clientvaulttransaction.findMany({
        where: {
            fromid: vault.id
        }
    })
    const vaultout = await prisma.transaction.findMany({
        where: {
            fromid: vault.id
        }
    })
    const vaultin = await prisma.transaction.findMany({
        where: {
            toid: vault.id
        }
    })
    const expenses = await prisma.expenses.findMany({
        where: {
            vaultid: vault.id
        }
    })
    const wtrans = await prisma.wtransaction.findMany({
        where: {
            fromid: vault.id
        }
    })
    //money owners
    for (let index = 0; index < ownertrans.length; index++) {
        const element = ownertrans[index];
        if (element.way == 'in') {
            summeryarray.push({
                "refid": element.refid,
                "vaultName": element.toname,
                "OperatorName": element.fromname,
                "Date": element.time.toISOString().toString().split('T')[0],
                "Income": element.amount,
                "Outcome": '',
                "Category": 'ايراد من شريك'
            })
        } else {
            summeryarray.push({
                "refid": element.refid,
                "vaultName": element.toname,
                "OperatorName": element.fromname,
                "Date": element.time.toISOString().toString().split('T')[0],
                "Income": '',
                "Outcome": element.amount,
                "Category": 'منصرف لشريك'
            })
        }

        // const v = await prisma.vault.findUnique({
        //     where: {
        //         id: vault.id
        //     }
        // })
        // await prisma.vault.update({
        //     where: {
        //         id: v.id
        //     },
        //     data: {
        //         value: v.value + element.amount
        //     }
        // })
    }
    //vault income transactions
    for (let index = 0; index < vaultin.length; index++) {
        const element = vaultin[index];
        summeryarray.push({
            "refid": element.refid,
            "vaultName": element.toname,
            "OperatorName": element.fromname,
            "Date": element.time.toISOString().toString().split('T')[0],
            "Income": element.amount,
            "Outcome": '',
            "Category": 'ايراد من خزينه اخرى'
        })
        // const v = await prisma.vault.findUnique({
        //     where: {
        //         id: vault.id
        //     }
        // })
        // await prisma.vault.update({
        //     where: {
        //         id: v.id
        //     },
        //     data: {
        //         value: v.value + element.amount
        //     }
        // })
    }
    //vault outcome transactions
    for (let index = 0; index < vaultout.length; index++) {
        const element = vaultout[index];
        summeryarray.push({
            "refid": element.refid,
            "vaultName": element.fromname,
            "OperatorName": element.toname,
            "Date": element.time.toISOString().toString().split('T')[0],
            "Income": '',
            "Outcome": element.amount,
            "Category": 'منصرف الي خزينه اخرى'
        })

        // const v = await prisma.vault.findUnique({
        //     where: {
        //         id: vault.id
        //     }
        // })
        // await prisma.vault.update({
        //     where: {
        //         id: v.id
        //     },
        //     data: {
        //         value: v.value - element.amount
        //     }
        // })
    }
    //expenses outcome transactions
    for (let index = 0; index < expenses.length; index++) {
        const element = expenses[index];
        summeryarray.push({
            "refid": element.refid,
            "vaultName": element.vaultname,
            "OperatorName": element.nestedcategoryname,
            "Date": element.time.toISOString().toString().split('T')[0],
            "Income": '',
            "Outcome": element.amount,
            "Category": 'مصروفات'
        })

        // const v = await prisma.vault.findUnique({
        //     where: {
        //         id: vault.id
        //     }
        // })
        // await prisma.vault.update({
        //     where: {
        //         id: v.id
        //     },
        //     data: {
        //         value: v.value - element.amount
        //     }
        // })
    }
    //workers outcome transactions
    for (let index = 0; index < wtrans.length; index++) {
        const element = wtrans[index];
        summeryarray.push({
            "refid": element.refid,
            "vaultName": element.fromname,
            "OperatorName": element.toname,
            "Date": element.time.toISOString().toString().split('T')[0],
            "Income": '',
            "Outcome": element.amount,
            "Category": 'دفعات مقاولين'
        })

        // const v = await prisma.vault.findUnique({
        //     where: {
        //         id: vault.id
        //     }
        // })
        // await prisma.vault.update({
        //     where: {
        //         id: v.id
        //     },
        //     data: {
        //         value: v.value - element.amount
        //     }
        // })
    }
    //clients transactions
    for (let index = 0; index < clients.length; index++) {
        const element = clients[index];
        if (element.way == 'out') {
            summeryarray.push({
                "refid": element.refid,
                "vaultName": element.fromname,
                "OperatorName": element.toname,
                "Date": element.time.toISOString().toString().split('T')[0],
                "Income": '',
                "Outcome": element.amount,
                "Category": 'منصرف الى عميل/مورد'
            })

            // const v = await prisma.vault.findUnique({
            //     where: {
            //         id: vault.id
            //     }
            // })
            // await prisma.vault.update({
            //     where: {
            //         id: v.id
            //     },
            //     data: {
            //         value: v.value - element.amount
            //     }
            // })
        } else {
            summeryarray.push({
                "refid": element.refid,
                "vaultName": element.fromname,
                "OperatorName": element.toname,
                "Date": element.time.toISOString().toString().split('T')[0],
                "Income": element.amount,
                "Outcome": '',
                "Category": 'وارد من عميل/مورد'
            })

            // const v = await prisma.vault.findUnique({
            //     where: {
            //         id: vault.id
            //     }
            // })
            // await prisma.vault.update({
            //     where: {
            //         id: v.id
            //     },
            //     data: {
            //         value: v.value + element.amount
            //     }
            // })
        }
    }
    summeryarray.sort((a, b) => {
        return new Date(a.Date) - new Date(b.Date)
    })
    let val = 0;
    for (let index = 0; index < summeryarray.length; index++) {
        const element = summeryarray[index];
        summeryarray[index].id = index + 1;
        val = val - element.Outcome;
        val = val + element.Income;
        summeryarray[index].Value = val;
    }
    res.status(200).json({ "status": 200, summeryarray })
})









const resetworkers = async () => {
    const wp = await prisma.workerpayout.findMany({})
    await prisma.workers.updateMany({
        data: {
            payed: 0,
            payment: 0
        }
    })
    for (let index = 0; index < wp.length; index++) {
        const element = wp[index];
        const w = await prisma.workers.findUnique({
            where: {
                id: element.workerid
            }
        })
        await prisma.workers.update({
            where: {
                id: w.id
            },
            data: {
                payment: w.payment + element.totalprice
            }
        })
    }

    const tr = await prisma.wtransaction.findMany({})
    for (let index = 0; index < tr.length; index++) {
        const element = tr[index];
        const w = await prisma.workers.findUnique({
            where: {
                id: element.toid
            }
        })
        await prisma.workers.update({
            where: {
                id: w.id
            },
            data: {
                payed: w.payed + element.amount
            }
        })
    }
    console.log('finished')
}
const rrrr = async () => {
    await prisma.clients.updateMany({
        data: {
            payment: 0,
            expense: 0
        }
    })
    console.log('clients reset')
    const income = await prisma.productincome.findMany({})
    const fridgereset = await prisma.fridgeproducts.updateMany({
        data: {
            price: 0,
            totalprice: 0
        }
    })
    console.log('income invoices started with amount of : ' + income.length);
    for (let index = 0; index < income.length; index++) {
        const element = income[index];
        const cl = await prisma.clients.findUnique({
            where: {
                id: element.fromid
            }
        })
        const ucl = await prisma.clients.update({
            where: {
                id: element.fromid
            },
            data: {
                expense: cl.expense + (element.amount * element.price)
            }
        })
    }
    console.log('income done')
    const clientvaulttransaction = await prisma.clientvaulttransaction.findMany({})
    console.log('clientvaulttransaction invoices started with amount of : ' + clientvaulttransaction.length);
    for (let index = 0; index < clientvaulttransaction.length; index++) {
        const element = clientvaulttransaction[index];
        const cl = await prisma.clients.findUnique({
            where: {
                id: element.toid
            }
        })
        const ucl = await prisma.clients.update({
            where: {
                id: element.toid
            },
            data: {
                payment: cl.payment + element.amount
            }
        })
    }
    console.log('clientvaulttransaction done')

    const clientmtrans = await prisma.clientm.findMany({})
    for (let index = 0; index < clientmtrans.length; index++) {
        const element = clientmtrans[index];
        const toclient = await prisma.clients.findUnique({
            where: {
                id: element.clientid
            }
        })
        if (element.way == 'in') {
            const clientupdate = await prisma.clients.update({
                where: {
                    id: toclient.id
                },
                data: {
                    expense: toclient.expense + Number(element.amount)
                }
            })
        } else if (element.way == 'out') {
            const clientupdate = await prisma.clients.update({
                where: {
                    id: toclient.id
                },
                data: {
                    payment: toclient.payment + Number(element.amount)
                }
            })
        }
    }
    console.log('clientm done')
}
const dd = async () => {
    const mm = await prisma.mtransaction.findMany({})
    for (let index = 0; index < mm.length; index++) {
        const element = mm[index];
        const c = await prisma.moneyowner.findUnique({
            where: {
                id: element.fromid
            }
        })
        await prisma.moneyowner.update({
            where: {
                id: element.fromid
            },
            data: {
                payment: c.payment + element.amount
            }
        })
    }
    console.log('done')
}
app.listen(1024, () =>
    console.log(`b2b app listening on port ${1024}!`),
);