import text from '../../constant/text.json';
import { jsPDF } from 'jspdf';
import { useEffect, useState } from 'react';
export default function PrintInvoice({ invoice }: { invoice: any }) {
  const [pdfOutput, setPdfOutput] = useState('');
  const [generating, setGenerating] = useState(true);

  const formatDateWithSpaces = (dateString: any) => {
    return dateString.replace(/\//g, ' / ');
  };

  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      putOnlyUsedFonts: true,
      floatPrecision: 16,
    });
    const tempDiv = document.createElement('div');
    const styles = `
    <style>
      * {
      font-size: 12px;
      line-height:1.3;
      }
      
      #table_header {
        width: 100%;
        font-size: 20px;
      }

      #table_info {
        width: 100%;
        margin-top:20px;
        font-size: 13px;
      }

      #table_info_1 {
        width: 100%;
        margin-top: 20px;
        font-size: 13px;
        border-top: 1px solid #000;
        border-bottom: 1px solid #000;
      }

      #table_info_2 {
        width: 100%;
        font-size: 13px;
        text-align: center;
        border-bottom: 1px solid #000;
      }

      #table_list {
        width: 100%;
        font-size: 12px;
        border-collapse: collapse;
      }

      #table_list tr th {
        border: 1px solid #000;
      }

      #table_list tr td {
        border: 1px solid #000;
      }

      .tr_background {
        background-color: #EBF1DE;
      }

      #table_footer {
        width: 100%;
        margin-top: 100px;
        font-size: 13px;
        border-top: 1px solid #000;
      }

      #table_footer_1 tr td {
        border: 1px solid #000;
      }

      #table_footer_2 {
        width: 100%;
        background-color: #EBF1DE;
      }

      #table_footer_2 tr td {
        border-left: 1px solid #000;
        border-right: 1px solid #000;
        border-bottom: 1px solid #000;
      }

      #tr_background_footer {
        background-color: #D8E4BC;
      }

      .table_price {
        width: 100%;
      }

      .table_price tr td {
        border: none !important;
      }

      #table_footer_3 {
        width: 100%;
        text-align: center;
        font-size: 13px;
      }

      table {
        border-spacing: 0px;
      }
       
    </style>
    `;
    tempDiv.innerHTML = `
      ${styles}
      <div style="width: 210mm; padding: 10mm; box-sizing: border-box;" class="exclude-tailwind">
        <table id="table_list" cellspacing="0" cellpadding="2">
          <tbody>
            <tr class="tr_background">
              <th width="12%">${text.txt_category_in}</th>
              <th width="7%">${text.txt_item_in} #</th>
              <th width="32%">${text.txt_item_name_in}</th>
              <th width="18%">${text.txt_packing_size_in}</th>
              <th width="7%">${text.txt_qty_upper_in}</th>
              <th width="12%">${text.txt_item_price_in}</th>
              <th width="12%">${text.txt_extended_price_in}</th>
            </tr>
            ${invoice.orderDetails?.orderItems
              .map(
                (orderItem: any) => `
              <tr>
                <td>${orderItem.product.sifKategorija.kategorija_naziv}</td>
                <td>${orderItem.product.item_number}</td>
                <td>${orderItem.product.item_name}</td>
                <td align="center">${orderItem.productItem.package}</td>
                <td align="center">${orderItem.kolicina}</td>
                <td>
                  <div style="display:flex;justify-content:space-between;">
                    <div>$</div>
                    <div style="align-items:end;text-align:end;padding-right:0;">${orderItem.price.toLocaleString(
                      'en-US',
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      },
                    )}</div>
                  </div>
                <td>
                  <div style="display:flex;justify-content:space-between;">
                    <div>$</div>
                    <div style="align-items:end;text-align:end;padding-right:0;">${orderItem.extended_price.toLocaleString(
                      'en-US',
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      },
                    )}</div>
                  </div>
                </td>
              </tr>
            `,
              )
              .join('')}
            <tr class="tr_background">
              <td colspan="5"></td>
              <td align="center"><b>${text.txt_extended_amount_in}</b></td>
              <td>
                <b>
                  <div style="display:flex;justify-content:space-between;">
                    <div>$</div>
                    <div style="align-items:end;text-align:end;padding-right:0;">${invoice.orderDetails?.orderItems
                      .map((item: any) => parseFloat(item.extended_price))
                      .reduce((sum: any, a: any) => sum + a, 0)
                      .toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                  </div>
                </b>
              </td>
            </tr>
          </tbody>
        </table>
        <table id="table_footer" cellspacing="0" cellpadding="0">
          <tbody>
            <tr>
              <td width="64%">
                <div>${text.txt_footer_line_in}</div>
              </td>
              <td width="36%">
                <table id="table_footer_2" cellspacing="0" cellpadding="2">
                  <tbody>
                    <tr>
                      <td>${text.txt_subtotal_in}</td>
                      <td>
                        <div style="display:flex;justify-content:space-between;">
                          <div>$</div>
                          <div style="align-items:end;text-align:end;padding-right:0;">${invoice.orderDetails?.orderItems
                            .map((item: any) => parseFloat(item.extended_price))
                            .reduce((sum: any, a: any) => sum + a, 0)
                            .toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>${text.txt_shipping_in}</td>
                      <td>
                        <div style="display:flex;justify-content:space-between;">
                          <div>$</div>
                          <div style="align-items:end;text-align:end;padding-right:0;">${invoice.orderDetails?.shipping.toLocaleString(
                            'en-US',
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            },
                          )}
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>${text.txt_pallet_cost_in}</td>
                      <td>
                        <div style="display:flex;justify-content:space-between;">
                          <div>$</div>
                          <div style="align-items:end;text-align:end;padding-right:0;">${invoice.orderDetails?.pallet_cost.toLocaleString(
                            'en-US',
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            },
                          )}
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>${text.txt_tax_in}</td>
                      <td>
                        <div style="display:flex;justify-content:space-between;">
                          <div>$</div>
                          <div style="align-items:end;text-align:end;padding-right:0;">${invoice.orderDetails?.tax.toLocaleString(
                            'en-US',
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            },
                          )}
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr id="tr_background_footer">
                      <td><b>${text.txt_total_in}</b></td>
                      <td>
                        <b>
                          <div style="display:flex;justify-content:space-between;">
                            <div>$</div>
                            <div style="align-items:end;text-align:end;padding-right:0;">${(
                              invoice.orderDetails?.orderItems
                                .map((item: any) =>
                                  parseFloat(item.extended_price),
                                )
                                .reduce((sum: any, a: any) => sum + a, 0) +
                              parseFloat(invoice.orderDetails?.shipping) +
                              parseFloat(invoice.orderDetails?.pallet_cost) +
                              parseFloat(invoice.orderDetails?.tax)
                            ).toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                            </div>
                          </div>
                        </b>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
    const footerHeight = 10;
    const bottomMargin = footerHeight + 15;
    const pageHeight = doc.internal.pageSize.height;
    doc.html(tempDiv, {
      callback: function (doc) {
        const pageCount = doc.getNumberOfPages();

        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          const footerText1 = ` ${text.txt_footer_in_1} ${invoice.orderDetails?.company_phone} ${text.txt_footer_in_or} ${text.txt_katava_mejl}`;
          doc.setFontSize(9);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(0, 0, 0);
          doc.text(footerText1, 10, pageHeight - bottomMargin);

          const footerText2 = `${text.txt_footer_in_2}`;
          doc.setFontSize(10);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(0, 0, 0);
          doc.text(footerText2, 100, pageHeight - footerHeight, {
            align: 'center',
          });

          const footerText3 = `(${i})`;
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(0, 0, 0);
          doc.text(footerText3, 200, pageHeight - footerHeight, {
            align: 'center',
          });
          // if (i > 1) {
            const hearderText1 = `KATAVA GROUP`;
            doc.setFontSize(20);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(0, 128, 0);
            doc.text(hearderText1, 10, 20, {
              align: 'left',
            });

            const hearderText2 = `${text.txt_katava_naziv}`;
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(0, 0, 0);
            doc.text(hearderText2, 10, 28, {
              align: 'left',
            });

            const hearderText3 = `${invoice.sushi.address}`;
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(0, 0, 0);
            doc.text(hearderText3, 10, 35, {
              align: 'left',
            });

            const hearderText4 = `${invoice.sushi.place}`;
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(0, 0, 0);
            doc.text(hearderText4, 10, 42, {
              align: 'left',
            });

            const hearderText5 = `${invoice.sushi.company_phone}`;
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(0, 0, 0);
            doc.text(hearderText5, 10, 49, {
              align: 'left',
            });

            const hearderText6 = `${text.txt_customer_invoice_in}`;
            doc.setFontSize(15);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(128, 128, 128);
            doc.text(hearderText6, 200, 20, {
              align: 'right',
            });

            const hearderText7 = `${text.txt_invoice_date_in}`;
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(0, 0, 0);
            doc.text(hearderText7, 150, 32, {
              align: 'left',
            });

            const hearderText8 = `${text.txt_invoice_number_u_in} #`;
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(0, 0, 0);
            doc.text(hearderText8, 150, 44, {
              align: 'left',
            });

            const hearderText9 = `| ${
              invoice.orderDetails?.invoice_date
                ? invoice.orderDetails?.invoice_date
                : ''
            }`;
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(0, 0, 0);
            doc.text(hearderText9, 172, 32, {
              align: 'left',
            });

            const hearderText10 = `| ${invoice.orderDetails?.invoice_number}`;
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(0, 0, 0);
            doc.text(hearderText10, 172, 44, {
              align: 'left',
            });

            doc.setLineWidth(0.5);
            doc.line(10, 53, 200, 53);

            const hearderText11 = `${text.txt_bill_to_in}:`;
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(0, 0, 0);
            doc.text(hearderText11, 10, 59, {
              align: 'left',
            });

            const hearderText12 = `${invoice.orderDetails?.company_name}`;
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(0, 0, 0);
            doc.text(hearderText12, 10, 64, {
              align: 'left',
            });

            const hearderText13 = `${invoice.orderDetails?.address}`;
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(0, 0, 0);
            doc.text(hearderText13, 10, 69, {
              align: 'left',
            });

            const hearderText14 = `${invoice.orderDetails?.company_phone}`;
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(0, 0, 0);
            doc.text(hearderText14, 10, 74, {
              align: 'left',
            });

            const hearderText15 = `${text.txt_ship_to_in}:`;
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(0, 0, 0);
            doc.text(hearderText15, 110, 59, {
              align: 'left',
            });

            const hearderText16 = `${invoice.orderDetails?.location_name}`;
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(0, 0, 0);
            doc.text(hearderText16, 110, 64, {
              align: 'left',
            });

            const hearderText17 = `${invoice.orderDetails?.location_address}`;
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(0, 0, 0);
            doc.text(hearderText17, 110, 69, {
              align: 'left',
            });

            const hearderText18 = `${text.txt_attn_in}: ${invoice.orderDetails?.company_name}`;
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(0, 0, 0);
            doc.text(hearderText18, 110, 74, {
              align: 'left',
            });

            doc.line(10, 78, 200, 78);

            const hearderText19 = `${text.txt_ordered_date_in}`;
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(0, 0, 0);
            doc.text(hearderText19, 115, 82, {
              align: 'left',
            });

            const hearderText20 = `${text.txt_ship_date_in}`;
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(0, 0, 0);
            doc.text(hearderText20, 145, 82, {
              align: 'left',
            });

            const hearderText21 = `${text.txt_terms_in}`;
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(0, 0, 0);
            doc.text(hearderText21, 180, 82, {
              align: 'left',
            });

            const hearderText22 = `${formatDateWithSpaces(
              invoice.orderDetails?.order_date,
            )}`;
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(0, 0, 0);
            doc.text(hearderText22, 115, 87, {
              align: 'left',
            });

            const hearderText23 = `${formatDateWithSpaces(
              invoice.orderDetails?.ship_date,
            )}`;
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(0, 0, 0);
            doc.text(hearderText23, 145, 87, {
              align: 'left',
            });

            const hearderText24 = `${text.txt_regular_in}`;
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(0, 0, 0);
            doc.text(hearderText24, 180, 87, {
              align: 'left',
            });
            doc.line(10, 92, 200, 92);

          // }
        }

        const pdfOutput = doc.output('bloburi');
        //@ts-ignore
        setPdfOutput(pdfOutput);
        setGenerating(false);
      },
      margin: [94, 0, 35, 0],
      html2canvas: {
        scale: 0.265,
      },
      autoPaging: true,
    });
  };

  useEffect(() => {
    generatePDF();
  }, [invoice, generating]);

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh' }}>
      {pdfOutput && !generating && (
        <iframe
          src={pdfOutput}
          style={{ width: '100%', height: '100%', border: 'none' }}
          title="Invoice PDF"
        />
      )}
    </div>
  );
}
