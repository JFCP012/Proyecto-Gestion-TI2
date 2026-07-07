import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CarritoService } from '../../services/carrito.service';
import { FacturaService } from '../../services/factura.service';
import { Factura as FacturaModel } from '../../models/Factura';
import { take } from 'rxjs/operators';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


@Component({
  selector: 'app-factura',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './factura.html',
  styleUrls: ['./factura.css']
})
export class Factura implements OnInit {
  carritoService = inject(CarritoService);
  facturaService = inject(FacturaService);
  private router = inject(Router);

  items$ = this.carritoService.cartItems$;
  subtotal = 0;
  envio = 0;
  total = 0;
  totalPacas = 0;

  factura: Partial<FacturaModel> = {
    nombreC: '',
    cedulaC: '',
    direccionC: '',
    telefonoC: ''
  };

  tipoEntrega: 'bodega' | 'envio' = 'envio';
  departamentoSeleccionado: string = '';
  municipioSeleccionado: string = '';

  departamentosYMunicipios: { [key: string]: string[] } = {
    'Amazonas': ['Leticia', 'Puerto Nariño'],
    'Antioquia': ['Medellín', 'Bello', 'Itagüí', 'Envigado', 'Rionegro', 'Apartadó', 'Turbo', 'Caucasia', 'Sabaneta', 'Copacabana', 'La Estrella', 'Caldas', 'Marinilla', 'Guarne', 'Carmen de Viboral', 'Santa fe de Antioquia', 'Sonsón', 'Yarumal', 'Andes', 'Urrao'],
    'Arauca': ['Arauca', 'Arauquita', 'Saravena', 'Tame'],
    'Atlántico': ['Barranquilla', 'Soledad', 'Malambo', 'Sabanalarga', 'Baranoa', 'Galapa', 'Puerto Colombia', 'Polonuevo', 'Sabanagrande'],
    'Bogotá D.C.': ['Bogotá D.C.'],
    'Bolívar': ['Cartagena', 'Magangué', 'Turbaco', 'Arjona', 'El Carmen de Bolívar', 'Mompós', 'María La Baja', 'San Juan Nepomuceno'],
    'Boyacá': ['Tunja', 'Duitama', 'Sogamoso', 'Chiquinquirá', 'Paipa', 'Puerto Boyacá', 'Villa de Leyva', 'Moniquirá', 'Garagoa'],
    'Caldas': ['Manizales', 'La Dorada', 'Villamaría', 'Chinchiná', 'Riosucio', 'Anserma', 'Supía', 'Pensilvania', 'Salamina'],
    'Caquetá': ['Florencia', 'San Vicente del Caguán', 'Cartagena del Chairá', 'Puerto Rico'],
    'Casanare': ['Yopal', 'Aguazul', 'Paz de Ariporo', 'Villanueva', 'Tauramena', 'Monterrey'],
    'Cauca': ['Popayán', 'Santander de Quilichao', 'Puerto Tejada', 'El Tambo', 'Piendamó', 'Corinto', 'Miranda', 'Caldono'],
    'Cesar': ['Valledupar', 'Aguachica', 'Agustín Codazzi', 'Bosconia', 'Curumaní', 'El Paso', 'La Paz', 'Pueblo Bello'],
    'Chocó': ['Quibdó', 'Istmina', 'Tadó', 'Condoto', 'Bahía Solano', 'Nuquí'],
    'Córdoba': ['Montería', 'Lorica', 'Cereté', 'Sahagún', 'Montelíbano', 'Planeta Rica', 'Tierralta', 'San Antero'],
    'Cundinamarca': ['Soacha', 'Facatativá', 'Chía', 'Zipaquirá', 'Mosquera', 'Funza', 'Madrid', 'Cajicá', 'Girardot', 'Fusagasugá', 'Tocancipá', 'Cota', 'La Calera'],
    'Guainía': ['Inírida'],
    'Guaviare': ['San José del Guaviare', 'Calamar', 'El Retorno'],
    'Huila': ['Neiva', 'Pitalito', 'Garzón', 'La Plata', 'Campoalegre', 'San Agustín', 'Aipe'],
    'La Guajira': ['Riohacha', 'Maicao', 'Uribia', 'San Juan del Cesar', 'Fonseca', 'Manaure'],
    'Magdalena': ['Santa Marta', 'Ciénaga', 'Fundación', 'El Banco', 'Plato', 'Aracataca', 'Pivijay'],
    'Meta': ['Villavicencio', 'Acacías', 'Granada', 'Puerto López', 'Puerto Gaitán', 'San Martín', 'Restrepo', 'Cumaral'],
    'Nariño': ['Pasto', 'Tumaco', 'Ipiales', 'Samaniego', 'Túquerres', 'La Unión', 'Sandoná', 'Barbacoas'],
    'Norte de Santander': ['Cúcuta', 'Ocaña', 'Villa del Rosario', 'Los Patios', 'Pamplona', 'Tibú', 'El Zulia', 'Ábrego'],
    'Putumayo': ['Mocoa', 'Puerto Asís', 'Orito', 'Valle del Guamuez', 'Sibundoy'],
    'Quindío': ['Armenia', 'Calarcá', 'Montenegro', 'Quimbaya', 'La Tebaida', 'Circasia', 'Salento', 'Filandia'],
    'Risaralda': ['Pereira', 'Dosquebradas', 'Santa Rosa de Cabal', 'La Virginia', 'Belén de Umbría', 'Quinchía', 'Apía'],
    'San Andrés y Providencia': ['San Andrés', 'Providencia'],
    'Santander': ['Bucaramanga', 'Floridablanca', 'Barrancabermeja', 'Girón', 'Piedecuesta', 'San Gil', 'Socorro', 'Málaga', 'Lebrija', 'Zapatoca', 'Barichara'],
    'Sucre': ['Sincelejo', 'Corozal', 'San Marcos', 'Sampués', 'Tolú', 'San Onofre', 'Coveñas', 'Majagual'],
    'Tolima': ['Ibagué', 'Espinal', 'Melgar', 'Honda', 'Chaparral', 'Mariquita', 'Líbano', 'Purificación', 'Guamo', 'Fresno'],
    'Valle del Cauca': ['Cali', 'Buenaventura', 'Palmira', 'Tuluá', 'Yumbo', 'Cartago', 'Buga', 'Jamundí', 'Florida', 'Pradera', 'Zarzal', 'Roldanillo', 'Sevilla'],
    'Vaupés': ['Mitú', 'Carurú'],
    'Vichada': ['Puerto Carreño', 'La Primavera', 'Santa Rosalía', 'Cumaribo']
  };

  departamentos: string[] = Object.keys(this.departamentosYMunicipios);
  municipiosDisponibles: string[] = [];

  compraExitosa = false;
  procesando = false;
  ultimaCompra: any = null;
  private logoBase64: string = '';

  ngOnInit() {
    // Subscribe to cart items to keep totals updated reactively
    this.items$.subscribe(items => {
      if (this.compraExitosa) return; // Prevent redirect and recalculations when cart is emptied after success
      
      this.subtotal = items.reduce((sum, item) => sum + (item.producto.precioU * item.cantidad), 0);
      this.totalPacas = items.reduce((sum, item) => sum + item.cantidad, 0);
      
      if (this.subtotal === 0) {
        this.router.navigate(['/carrito']);
      }
      
      this.actualizarEnvio();
    });

    this.cargarLogo();
  }

  actualizarCantidad(item: any, nuevaCantidad: number) {
    if (nuevaCantidad < 1) nuevaCantidad = 1;
    if (nuevaCantidad > item.producto.stock) nuevaCantidad = item.producto.stock;
    this.carritoService.actualizarCantidad(item.producto.idHeno, nuevaCantidad);
  }

  onDepartamentoChange() {
    this.municipioSeleccionado = '';
    if (this.departamentoSeleccionado) {
      this.municipiosDisponibles = this.departamentosYMunicipios[this.departamentoSeleccionado] || [];
    } else {
      this.municipiosDisponibles = [];
    }
  }

  onTipoEntregaChange() {
    this.actualizarEnvio();
  }

  actualizarEnvio() {
    if (this.tipoEntrega === 'bodega') {
      this.envio = 0;
    } else {
      this.envio = this.totalPacas * 2000;
    }
    this.total = this.subtotal + this.envio;
  }


  private cargarLogo() {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;

      // Fondo blanco para que la transparencia del PNG no cause problemas
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.drawImage(img, 0, 0);
      this.logoBase64 = canvas.toDataURL('image/png');
      console.log('✅ Logo cargado correctamente');
    };
    img.onerror = (e) => console.error('❌ Error cargando logo:', e);
    img.src = '/assets/logo.png';
  }

  procesarCompra() {
    if (!this.factura.nombreC || !this.factura.cedulaC || !this.factura.telefonoC) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    if (this.tipoEntrega === 'envio') {
      if (this.totalPacas < 50) {
        alert('La cantidad mínima para envíos es de 50 pacas. Por favor, ajuste su pedido.');
        return;
      }
      if (!this.factura.direccionC || !this.departamentoSeleccionado || !this.municipioSeleccionado) {
        alert('Por favor complete todos los campos de la dirección de envío');
        return;
      }
      this.factura.direccionC = `${this.factura.direccionC}, ${this.municipioSeleccionado}, ${this.departamentoSeleccionado}`;
    } else {
      this.factura.direccionC = 'Finca Santa Helena - La Dorada, Caldas';
    }

    this.procesando = true;
    const hoy = new Date();
    this.factura.fechaFactura = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
    this.factura.totalVenta = this.total;
    this.factura.envio = this.envio;

    this.items$.pipe(take(1)).subscribe(items => {
      const detalles = items.map(item => ({
        idHeno: item.producto.idHeno,
        cantidad: item.cantidad
      }));

      const compraDTO = {
        factura: {
          ...this.factura,
          administrador: { cedulaV: 1 }
        },
        detalles: detalles
      };

      this.facturaService.procesarCompra(compraDTO).subscribe({
        next: (res) => {
          console.log('Factura generada en BD:', res);
          this.compraExitosa = true;
          this.procesando = false;

          this.ultimaCompra = {
            facturaGuardada: res,
            detalles: compraDTO.detalles,
            nombresProductos: items.map(i => ({
              id: i.producto.idHeno,
              nombre: i.producto.nombre,
              precioU: i.producto.precioU
            }))
          };

          this.carritoService.vaciarCarrito();
        },
        error: (err) => {
          console.error('Error al procesar la compra', err);
          alert('Ocurrió un error al procesar la compra. Revisa el stock disponible.');
          this.procesando = false;
        }
      });
    });
  }

  descargarFacturaPDF() {
    if (!this.ultimaCompra) return;

    const doc = new jsPDF();
    const f = this.ultimaCompra.facturaGuardada;

    doc.setFont("helvetica");

    // ── Logo ──────────────────────────────────────────────────────────
    if (this.logoBase64) {
      doc.addImage(this.logoBase64, 'PNG', 14, 8, 28, 28);
    }

    // Nombre empresa
    doc.setFontSize(22);
    doc.setTextColor(56, 161, 105);
    doc.text("AgroHeno", 46, 22);

    // Línea separadora
    doc.setDrawColor(56, 161, 105);
    doc.setLineWidth(0.5);
    doc.line(14, 40, 196, 40);

    // Título
    doc.setFontSize(14);
    doc.setTextColor(30, 41, 59);
    doc.text("FACTURA DE VENTA", 14, 50);

    // Info factura
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text(`N° Factura: ${f.idFactura || 'Pendiente'}`, 14, 60);
    doc.text(`Fecha: ${f.fechaFactura || this.factura.fechaFactura}`, 14, 67);
    const tipoVenta = this.tipoEntrega === 'bodega' ? 'POS' : 'Online';
    doc.text(`Tipo de Venta: ${tipoVenta}`, 14, 74);


    // Datos del cliente
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text("Datos del Cliente:", 120, 50);

    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text(`Nombre: ${f.nombreC || this.factura.nombreC}`, 120, 60);
    doc.text(`Cédula/NIT: ${f.cedulaC || this.factura.cedulaC}`, 120, 67);
    doc.text(`Teléfono: ${f.telefonoC || this.factura.telefonoC}`, 120, 74);
    doc.text(`Dirección: ${f.direccionC || this.factura.direccionC}`, 120, 81);

    // Tabla productos
    const tableBody = this.ultimaCompra.detalles.map((d: any) => {
      const prodInfo = this.ultimaCompra.nombresProductos.find((p: any) => p.id === d.idHeno);
      const nombre = prodInfo ? prodInfo.nombre : 'Producto';
      const precio = prodInfo ? prodInfo.precioU : 0;
      const totalLinea = precio * d.cantidad;
      return [
        d.idHeno,
        nombre,
        `$${precio.toLocaleString('es-CO')}`,
        d.cantidad,
        `$${totalLinea.toLocaleString('es-CO')}`
      ];
    });

    autoTable(doc, {
      startY: 90,
      head: [['ID Producto', 'Tipo de Heno', 'Costo Unitario', 'Cantidad', 'Costo Total']],
      body: tableBody,
      theme: 'grid',
      headStyles: { fillColor: [56, 161, 105] },
      alternateRowStyles: { fillColor: [240, 253, 244] }  // ✅ filas alternas verde muy suave
    });

    // Totales
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    const totalVenta = f.totalVenta ?? this.factura.totalVenta;
    const envio = f.envio ?? this.factura.envio ?? 0;
    const subtotal = totalVenta - envio;

    // Caja de totales
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(130, finalY - 5, 66, 30, 2, 2, 'F');

    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text(`Subtotal:`, 135, finalY + 3);
    doc.text(`$${subtotal.toLocaleString('es-CO')}`, 192, finalY + 3, { align: 'right' });

    doc.text(`Envío:`, 135, finalY + 10);
    doc.text(`$${envio.toLocaleString('es-CO')}`, 192, finalY + 10, { align: 'right' });

    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59);
    doc.setFont("helvetica", "bold");
    doc.text(`TOTAL:`, 135, finalY + 20);
    doc.text(`$${totalVenta.toLocaleString('es-CO')}`, 192, finalY + 20, { align: 'right' });
    doc.setFont("helvetica", "normal");

    // Footer
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 275, 196, 275);
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.text("Gracias por su compra en AgroHeno.", 105, 281, { align: 'center' });

    doc.save(`Factura_AgroHeno_${f.idFactura || Date.now()}.pdf`);
  }

  volverInicio() {
    this.router.navigate(['/producto']);
  }

  volverCarrito() {
    this.router.navigate(['/carrito']);
  }
}