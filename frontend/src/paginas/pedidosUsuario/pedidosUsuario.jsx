import React, { useEffect, useState } from 'react';
import './pedidosUsuario.css';

import { useNavigate } from 'react-router-dom';

import logo from '/VynceLogo.png'

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts.js';
pdfMake.vfs = pdfFonts.vfs;


import Navbar from '../../componentes/navbar/navbar';

export default function PedidosUsuario() {

    const userId = localStorage.getItem('userId');
    const nombreUsuario = localStorage.getItem('nombreUsuario');
    const [datosPedidos, setDatosPedidos] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                const response = await fetch(`http://localhost:5000/pedido/pedidosUsuario/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setDatosPedidos(data);
                } else {
                    console.error('Error al obtener los pedidos del usuario');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchPedidos();
    }, [userId]);

    const handleDetallesClick = (pedidoId) => {
        navigate(`/pedido/${pedidoId}`);
    };

    const getBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const generarPDF = async (pedido) => {

        const response = await fetch(logo); // logo viene del import
        const blob = await response.blob();
        const logoBase64 = await getBase64(blob);

        const fechaCompra = new Date(pedido.createdAt).toLocaleDateString();
        const productosTabla = pedido.productos.map((item, index) => ([
            index + 1,
            item.producto.nombre,
            item.cantidad,
            `$${item.producto.precio.toFixed(2)}`,
            `$${(item.cantidad * item.producto.precio).toFixed(2)}`
        ]));

        const docDefinition = {
        content: [
            {
            columns: [
                {
                image: logoBase64,
                width: 100,
                margin: [0, 0, 0, 10]
                },
                {
                width: '*',
                alignment: 'center',
                margin: [0, 30, 0, 0],
                stack: [
                    { text: 'FACTURA DE PEDIDO', style: 'header' },
                    { text: 'Vynce S.A. de C.V.', style: 'subheader' },
                    { text: `Fecha de compra: ${fechaCompra}`, style: 'fecha' }
                ]
                }
            ]
            },
            {
            table: {
                headerRows: 1,
                widths: ['auto', '*', 'auto', 'auto', 'auto'],
                body: [
                [
                    { text: 'NO. PRODUCTO', style: 'tableHeader' },
                    { text: 'PRODUCTO', style: 'tableHeader' },
                    { text: 'CANTIDAD', style: 'tableHeader' },
                    { text: 'PRECIO', style: 'tableHeader' },
                    { text: 'SUBTOTAL', style: 'tableHeader' }
                ],
                ...productosTabla.map((fila) =>
                    fila.map((celda) => ({ text: celda, style: 'tableCell' }))
                ),
                [
                    { text: '', colSpan: 3, border: [1, 1, 1, 1] }, {}, {},
                    { text: 'TOTAL', style: 'tableTotal' },
                    {
                    text: `$${pedido.total.toFixed(2)}`,
                    style: 'tableTotal'
                    }
                ]
                ]
            },
            layout: {
                fillColor: (rowIndex, node, columnIndex) =>
                rowIndex === 0
                    ? '#000'
                    : (rowIndex % 2 === 0 ? '#f9f9f9' : null),
                hLineWidth: () => 0.5,
                vLineWidth: () => 0.5,
                hLineColor: () => '#ccc',
                vLineColor: () => '#ccc'
            },
            margin: [0, 20, 0, 10]
            }
        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true
            },
            subheader: {
                fontSize: 12
            },
            fecha: {
                fontSize: 10,
                margin: [0, 5, 0, 0]
            },
            tableHeader: {
                bold: true,
                fontSize: 12,
                color: 'white',
                fillColor: '#000',
                margin: [5, 5, 5, 5],
                alignment: 'center'
            },
            tableCell: {
                fontSize: 10,
                margin: [5, 5, 5, 5],
                fontTransform: 'uppercase',
                alignment: 'center'
            },
            tableTotal: {
                bold: true,
                fontSize: 10,
                margin: [2, 5, 2, 5],
                alignment: 'center'
            }
        },
        footer: function (currentPage, pageCount) {
            return {
            margin: [40, 0, 40, 10],
            fontSize: 10,
            columns: [
                {
                text: 'Correo: vynce@gmail.com \nTeléfono: (55) 1234-5678',
                alignment: 'left'
                },
                {
                text: '© 2025 Vynce S.A. de C.V.\nTodos los derechos reservados',
                alignment: 'center'
                },
                {
                text: `Página ${currentPage} de ${pageCount}`,
                alignment: 'right'
                }
            ]
            };
        }
        };


        pdfMake.createPdf(docDefinition).download(`pedido-${fechaCompra}-${nombreUsuario}.pdf`);
    };

    return (
        <div className='pedidosUsuario'>
            <Navbar />
            <div className='pedidosUsuario-container'>
                <h1>MIS PEDIDOS</h1>
                <div className="pedidosTablaContainer">
                    <table>
                        <thead>
                            <tr>
                                <th>No. Pedido</th>
                                <th>Fecha</th>
                                <th>Total</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {datosPedidos.map((pedido, index) => (
                                <tr key={pedido._id}>
                                    <td>{index + 1}</td>
                                    <td>{new Date(pedido.createdAt).toLocaleDateString()}</td>
                                    <td>${pedido.total.toFixed(2)}</td>
                                    <td>{pedido.estadoPedido}</td>
                                    <td>
                                        {pedido.estadoPedido === 'Pendiente' ? (
                                            <button
                                                className='botonPedido btnDetalles'
                                                onClick={() => handleDetallesClick(pedido._id)}
                                            >
                                                Ver Detalles
                                            </button>
                                        ) : pedido.estadoPedido === 'Aceptado' ? (
                                            <button
                                                className='botonPedido btnGenerarPDF'
                                                onClick={() => generarPDF(pedido)}
                                            >
                                                Generar PDF
                                            </button>
                                        ) : pedido.estadoPedido === 'Entregado' ? (
                                            <button
                                                className='botonPedido btnGenerarPDF'
                                                onClick={() => generarPDF(pedido)}
                                            >
                                                Generar PDF
                                            </button>
                                        ) : pedido.estadoPedido === 'Cancelado' ? (
                                            <p>Pedido Cancelado</p>
                                        ) : null}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
