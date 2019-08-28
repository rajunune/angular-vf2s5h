import { Component, ViewEncapsulation, ViewChildren, QueryList } from '@angular/core';
import { GridComponent } from '@progress/kendo-angular-grid';
import { exportPDF, Group } from '@progress/kendo-drawing';
import { saveAs } from '@progress/kendo-file-saver';

import { products } from './products';

@Component({
    selector: 'my-app',
    template: `
        <button type="button" class="k-button" (click)="exportGrids()">Export</button>
        <kendo-grid [kendoGridBinding]="products1" [pageable]="true" [pageSize]="10" [height]="430">
            <kendo-grid-column field="ProductID" title="ID" width="100">
            </kendo-grid-column>
            <kendo-grid-column field="ProductName" title="Name">
            </kendo-grid-column>
            <kendo-grid-column field="image" title="Image ">
              <ng-template kendoGridCellTemplate>
                <img class="icon" src='https://www.fnordware.com/superpng/pngtest16rgba.png' />
              </ng-template>              
            </kendo-grid-column>
            <kendo-grid-pdf fileName="Products.pdf" paperSize="A4" [allPages]="true" [repeatHeaders]="true" margin="2cm">
                <ng-template kendoGridPDFTemplate let-pageNum="pageNum" let-totalPages="totalPages">
                 <div class="page-template">
                    <div class="header">
                      <div style="float: right">Page {{ pageNum }} of {{ totalPages }}</div>
                      Multi-page grid with automatic page breaking
                    </div>
                    <div class="footer">
                      Page {{ pageNum }} of {{ totalPages }}
                    </div>
                  </div>
                </ng-template>
            </kendo-grid-pdf>
        </kendo-grid>
        <kendo-grid [kendoGridBinding]="products2" [pageable]="true" [pageSize]="10" [height]="430">
            <kendo-grid-column field="ProductID" title="ID" width="100">
            </kendo-grid-column>
            <kendo-grid-column field="ProductName" title="Name">
            </kendo-grid-column>
            <kendo-grid-column field="image" title="Image ">
              <ng-template kendoGridCellTemplate>
                <img class="icon" src='https://www.fnordware.com/superpng/pngtest16rgba.png' />
              </ng-template>              
            </kendo-grid-column>
            <kendo-grid-pdf fileName="Products.pdf" paperSize="A4" [allPages]="true" [repeatHeaders]="true" margin="2cm">
                <ng-template kendoGridPDFTemplate let-pageNum="pageNum" let-totalPages="totalPages">
                 <div class="page-template">
                    <div class="header">
                      <div style="float: right">Page {{ pageNum }} of {{ totalPages }}</div>
                      Multi-page grid with automatic page breaking
                    </div>
                    <div class="footer">
                      Page {{ pageNum }} of {{ totalPages }}
                    </div>
                  </div>
                </ng-template>
            </kendo-grid-pdf>
        </kendo-grid>
    `,
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./pdf-styles.css', './page-template.css']
})
export class AppComponent {
    public products1: any[] = products.slice(0, 40);
    public products2: any[] = products.slice(40);

    @ViewChildren(GridComponent)
    public grids: QueryList<GridComponent>;

    public exportGrids(): void {
        const promises = this.grids.map(grid => grid.drawPDF());
        Promise.all(promises).then(groups => {
            const rootGroup = new Group({
                pdf: {
                    multiPage: true
                }
            });
            groups.forEach((group) => {
                rootGroup.append(...group.children);
            });

            return exportPDF(rootGroup, { paperSize: 'A4' });
        }).then(dataUri => {
            saveAs(dataUri, 'MultipleGrids.pdf');
        });
    }
}
