import React, {
  Component
} from "react";
import {Content} from 'carbon-components-react/lib/components/UIShell';
import { DataTable, Button, Tooltip } from 'carbon-components-react';

import FDownloadActionTooltip from '../../molecules/FDownloadActionTooltip'

const {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  TableHeader,
  TableToolbar,
  TableToolbarSearch,
  TableToolbarMenu,
  TableToolbarAction,
  TableToolbarContent,
  TableBatchActions,
  TableBatchAction,
  TableSelectAll,
  TableSelectRow
} = DataTable;


class FTable extends Component {

  constructor(props){
    super(props);
    this.consoleFilteredRows = this.consoleFilteredRows.bind(this);
  }

  consoleFilteredRows(rows){
    console.log(rows);
  }

  render() {



    return (
      <div className="f-table-comp-wrapper">
              <DataTable
                rows={this.props.rows}
                headers={this.props.headers}
                isSortable
                render={({ rows, headers, getHeaderProps, getBatchActionProps, onInputChange, sortBy }) => (
                  <TableContainer title="DataTable with Toolbar">
                    <TableToolbar>
                        <TableToolbarContent>
                          <TableToolbarSearch  onChange={onInputChange} />
                          <TableToolbarAction onClick={this.props.onClickDownloadBtn}>
                            <FDownloadActionTooltip
                              data={this.props.rows}
                              />
                        </TableToolbarAction>
                          {
                            // <Button onClick={() => this.consoleFilteredRows(rows)} small kind="primary">
                            //   Add new
                            // </Button>
                          }

                        </TableToolbarContent>
                      </TableToolbar>
                      <div className="data-table-wrapper">
                    <Table>
                      <TableHead>
                        <TableRow>
                          {headers.map(header => (
                            <TableHeader {...getHeaderProps({ header })}>
                              {header.header}
                            </TableHeader>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {rows.map(row => (
                          <TableRow key={row.id}>
                            {row.cells.map(cell => (
                              <TableCell key={cell.id}>{cell.value}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    </div>
                  </TableContainer>
                )}
              />
      </div>
    )
  }
}
export default FTable;
