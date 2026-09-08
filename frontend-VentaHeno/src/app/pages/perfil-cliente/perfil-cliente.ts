import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Cliente } from '../../models/Cliente';
import { ClienteService } from '../../services/cliente.service';
import { ReportesService } from '../../services/reportes.service';
import { ReporteVentaCliente, FacturaReporte, DetalleFacturaReporte } from '../../models/reporte-venta.model';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-perfil-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil-cliente.html',
  styleUrl: './perfil-cliente.css'
})
export class PerfilCliente implements OnInit {
  private router = inject(Router);
  private clienteService = inject(ClienteService);
  private reportesService = inject(ReportesService);
  private cdr = inject(ChangeDetectorRef);

  cliente: Cliente | null = null;
  pestanaActiva: 'perfil' | 'facturas' | 'editar' = 'perfil';

  // Mis Facturas
  reporteCliente: ReporteVentaCliente | null = null;
  cargandoFacturas: boolean = false;
  errorFacturas: string | null = null;

  // Editar Perfil
  clienteEdit = {
    nombre: '',
    telefono: '',
    direccion: ''
  };
  archivoImagenSeleccionado: File | null = null;
  previewImagenUrl: string | null = null;
  guardandoPerfil: boolean = false;
  mensajeExitoPerfil: string | null = null;
  mensajeErrorPerfil: string | null = null;

  private logoBase64: string = '';
  private logoAspectRatio: number = 1.0;

  ngOnInit() {
    const guardado = localStorage.getItem('clienteActivo');
    if (guardado) {
      try {
        this.cliente = JSON.parse(guardado);
      } catch {
        this.cliente = null;
      }
    }

    if (!this.cliente) {
      this.router.navigate(['/']);
      return;
    }

    this.cargarLogo();
    this.iniciarFormularioEdit();
  }

  private cargarLogo() {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      this.logoAspectRatio = img.width / img.height;
      this.logoBase64 = canvas.toDataURL('image/png');
    };
    img.src = '/assets/Imagenes/Logo2.png';
  }

  iniciarFormularioEdit() {
    if (this.cliente) {
      this.clienteEdit = {
        nombre: this.cliente.nombre || '',
        telefono: this.cliente.telefono || '',
        direccion: this.cliente.direccion || ''
      };
      this.previewImagenUrl = this.cliente.imagen || null;
      this.archivoImagenSeleccionado = null;
    }
  }

  cambiarPestana(pestana: 'perfil' | 'facturas' | 'editar') {
    this.pestanaActiva = pestana;
    this.mensajeExitoPerfil = null;
    this.mensajeErrorPerfil = null;

    if (pestana === 'facturas' && !this.reporteCliente) {
      this.cargarFacturas();
    } else if (pestana === 'editar') {
      this.iniciarFormularioEdit();
    }
  }

  cargarFacturas() {
    if (!this.cliente || !this.cliente.cedula) return;

    this.cargandoFacturas = true;
    this.errorFacturas = null;
    this.cdr.detectChanges();

    this.reportesService.obtenerReportePorCliente(this.cliente.cedula).subscribe({
      next: (data) => {
        this.reporteCliente = data;
        this.cargandoFacturas = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar facturas:', err);
        this.errorFacturas = 'No se pudieron cargar tus facturas o no posees compras registradas.';
        this.cargandoFacturas = false;
        this.cdr.detectChanges();
      }
    });
  }

  descargarFacturaPDF(f: FacturaReporte) {
    if (!this.cliente) return;

    try {
      const doc = new jsPDF();
      doc.setFont('helvetica');

      // Logo
      if (this.logoBase64) {
        const height = 18;
        const width = height * this.logoAspectRatio;
        doc.addImage(this.logoBase64, 'PNG', 14, 10, width, height);

        doc.setFontSize(20);
        doc.setTextColor(56, 161, 105);
        doc.text('AgroHeno', 14 + width + 4, 22);
      } else {
        doc.setFontSize(20);
        doc.setTextColor(56, 161, 105);
        doc.text('AgroHeno', 14, 22);
      }

      // Línea separadora
      doc.setDrawColor(56, 161, 105);
      doc.setLineWidth(0.5);
      doc.line(14, 34, 196, 34);

      // Título
      doc.setFontSize(14);
      doc.setTextColor(30, 41, 59);
      doc.text('FACTURA DE VENTA', 14, 44);

      // Info Factura
      doc.setFontSize(10);
      doc.setTextColor(71, 85, 105);
      doc.text(`N° Factura: #${f.idFactura}`, 14, 52);
      doc.text(`Fecha: ${f.fechaFactura}`, 14, 59);

      // Datos Cliente
      doc.setFontSize(11);
      doc.setTextColor(30, 41, 59);
      doc.text('Datos del Cliente:', 120, 44);

      doc.setFontSize(10);
      doc.setTextColor(71, 85, 105);
      doc.text(`Nombre: ${f.nombreCliente || this.cliente.nombre}`, 120, 52);
      doc.text(`Cédula/NIT: ${f.cedulaCliente || this.cliente.cedula}`, 120, 59);
      if (this.cliente.telefono) {
        doc.text(`Teléfono: ${this.cliente.telefono}`, 120, 66);
      }
      if (this.cliente.direccion) {
        const dir = `Dirección: ${this.cliente.direccion}`;
        const dirLines = doc.splitTextToSize(dir, 75);
        doc.text(dirLines, 120, 73);
      }

      // Tabla de productos
      const tableBody = f.detalles.map((d: DetalleFacturaReporte) => [
        d.tipoHeno,
        `$${d.precioUnitario.toLocaleString('es-CO')}`,
        d.cantidad,
        `$${d.subtotal.toLocaleString('es-CO')}`
      ]);

      autoTable(doc, {
        startY: 85,
        head: [['Tipo de Heno', 'Precio Unitario', 'Cantidad', 'Subtotal']],
        body: tableBody,
        theme: 'grid',
        headStyles: { fillColor: [56, 161, 105] },
        alternateRowStyles: { fillColor: [240, 253, 244] }
      });

      // Totales
      const finalY = (doc as any).lastAutoTable.finalY + 10;
      const totalVenta = f.totalVenta || 0;
      const envio = f.envio || 0;
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
      doc.setFont('helvetica', 'bold');
      doc.text(`TOTAL:`, 135, finalY + 20);
      doc.text(`$${totalVenta.toLocaleString('es-CO')}`, 192, finalY + 20, { align: 'right' });

      // Footer
      doc.setFont('helvetica', 'normal');
      doc.setDrawColor(200, 200, 200);
      doc.line(14, 275, 196, 275);
      doc.setFontSize(9);
      doc.setTextColor(148, 163, 184);
      doc.text('Gracias por su compra en AgroHeno.', 105, 281, { align: 'center' });

      doc.save(`Factura_${f.idFactura}_${this.cliente.cedula}.pdf`);
    } catch (e: any) {
      console.error('Error al generar PDF:', e);
      alert('Error al generar el archivo PDF: ' + e.message);
    }
  }

  onImagenSeleccionada(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      if (!file.type.startsWith('image/')) {
        this.mensajeErrorPerfil = 'Por favor selecciona un archivo de imagen válido (JPG, PNG).';
        return;
      }

      this.archivoImagenSeleccionado = file;
      this.mensajeErrorPerfil = null;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewImagenUrl = e.target.result;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  guardarCambiosPerfil() {
    if (!this.cliente) return;

    if (!this.clienteEdit.nombre.trim()) {
      this.mensajeErrorPerfil = 'El nombre no puede estar vacío.';
      return;
    }

    this.guardandoPerfil = true;
    this.mensajeExitoPerfil = null;
    this.mensajeErrorPerfil = null;
    this.cdr.detectChanges();

    const clienteActualizado: Cliente = {
      cedula: this.cliente.cedula, // Mantiene la cédula intacta e inmutable
      nombre: this.clienteEdit.nombre.trim(),
      telefono: this.clienteEdit.telefono.trim(),
      direccion: this.clienteEdit.direccion.trim(),
      clave: this.cliente.clave,
      imagen: this.cliente.imagen
    };

    this.clienteService.actualizarCliente(clienteActualizado, this.archivoImagenSeleccionado).subscribe({
      next: (res) => {
        this.cliente = res;
        localStorage.setItem('clienteActivo', JSON.stringify(res));
        this.guardandoPerfil = false;
        this.mensajeExitoPerfil = '¡Tu perfil ha sido actualizado con éxito!';
        this.archivoImagenSeleccionado = null;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al actualizar perfil:', err);
        this.guardandoPerfil = false;
        this.mensajeErrorPerfil = err.error?.message || 'Error al guardar los cambios en el servidor.';
        this.cdr.detectChanges();
      }
    });
  }

  volver() {
    this.router.navigate(['/']);
  }

  cerrarSesion() {
    localStorage.removeItem('clienteActivo');
    window.location.href = '/';
  }
}
