import React from 'react';
//import NavPartida from './NavPartida';
//import NavPartida2 from './NavPartida2';
import EscenaService from "../../../services/escena.service"



import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import Paper from '@material-ui/core/Paper';
import { AutoSizer, Column, Table } from 'react-virtualized';
import personajeService from '../../../services/personaje.service';
import "../../../css/Checkbox.css"


const styles = (theme) => ({
  flexContainer: {
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
  },
  table: {
    // temporary right-to-left patch, waiting for
    // https://github.com/bvaughn/react-virtualized/issues/454
    '& .ReactVirtualized__Table__headerRow': {
      flip: false,
      paddingRight: theme.direction === 'rtl' ? '0 !important' : undefined,
    },
  },
  tableRow: {
    cursor: 'pointer',
  },
  tableRowHover: {
    '&:hover': {
      backgroundColor: theme.palette.grey[200],
    },
  },
  tableCell: {
    flex: 1,
  },
  noClick: {
    cursor: 'initial',
  },
});

class MuiVirtualizedTable extends React.PureComponent {
  static defaultProps = {
    headerHeight: 48,
    rowHeight: 48,
  };

  getRowClassName = ({ index }) => {
    const { classes, onRowClick } = this.props;

    return clsx(classes.tableRow, classes.flexContainer, {
      [classes.tableRowHover]: index !== -1 && onRowClick != null,
    });
  };

  cellRenderer = ({ cellData, columnIndex }) => {
    const { columns, classes, rowHeight, onRowClick } = this.props;
    return (
      <TableCell
        component="div"
        className={clsx(classes.tableCell, classes.flexContainer, {
          [classes.noClick]: onRowClick == null,
        })}
        variant="body"
        style={{ height: rowHeight }}
        align={(columnIndex != null && columns[columnIndex].numeric) || false ? 'right' : 'left'}
      >
        {cellData}
      </TableCell>
    );
  };

  headerRenderer = ({ label, columnIndex }) => {
    const { headerHeight, columns, classes } = this.props;

    return (
      <TableCell
        component="div"
        className={clsx(classes.tableCell, classes.flexContainer, classes.noClick)}
        variant="head"
        style={{ height: headerHeight }}
        align={columns[columnIndex].numeric || false ? 'right' : 'left'}
      >
        <span>{label}</span>
      </TableCell>
    );
  };

  render() {
    const { classes, columns, rowHeight, headerHeight, ...tableProps } = this.props;
    return (
      <AutoSizer>
        {({ height, width }) => (
          <Table
            height={height}
            width={width}
            rowHeight={rowHeight}
            gridStyle={{
              direction: 'inherit',
            }}
            headerHeight={headerHeight}
            className={classes.table}
            {...tableProps}
            rowClassName={this.getRowClassName}
          >
            {columns.map(({ dataKey, ...other }, index) => {
              return (
                <Column
                  key={dataKey}
                  headerRenderer={(headerProps) =>
                    this.headerRenderer({
                      ...headerProps,
                      columnIndex: index,
                    })
                  }
                  className={classes.flexContainer}
                  cellRenderer={this.cellRenderer}
                  dataKey={dataKey}
                  {...other}
                />
              );
            })}
          </Table>
        )}
      </AutoSizer>
    );
  }
}

MuiVirtualizedTable.propTypes = {
  classes: PropTypes.object.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      dataKey: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      numeric: PropTypes.bool,
      width: PropTypes.number.isRequired,
    }),
  ).isRequired,
  headerHeight: PropTypes.number,
  onRowClick: PropTypes.func,
  rowHeight: PropTypes.number,
};

const VirtualizedTable = withStyles(styles)(MuiVirtualizedTable);

// ---



function createData(id, nombre, leer, escribir, defecto, oculto) {
  return { id, nombre, leer, escribir, defecto, oculto };
}


export default class MenuDestinatarios extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      personajes: [],
      carga: null,
      rows: [],
      rowsPnjs: [],
      mostrarPjs: true,
      mostrarPnjs: false

    };
    this.handleSubmit = this.handleSubmit.bind(this);

  }
  nombre(id) {
    for (let i = 0; i < this.state.nombres.length; i++) {
      if (id === this.state.nombres[i].id) return this.state.nombres[i].nombre;
    }
  }

  componentDidMount = async e => {

    this.setState({
      personajes: await EscenaService.destinatarios(this.props.partida, this.props.escena),
      nombres: await personajeService.lista(this.props.partida)
    });

    this.setState({ carga: 1 })
    let asignado = []

    for (let i = 0; i < this.state.nombres.length; i++) {
      
      let b = await (personajeService.isAsignado(this.state.nombres[i].id))
      asignado.push(b)
    }
    for (let i = 0; i < this.state.personajes.length / 5; i++) {
      if (asignado[i]) {
        this.state.rows.push(createData(i, ...[this.nombre(this.state.personajes[i * 5]),
        <div>

          <label className="checkbox bounce">
            <input type="checkbox" id={"checkbox1" + (i * 5 + 1)} name={this.state.personajes[i * 5]} value={this.state.personajes[i * 5 + 1]} defaultChecked={this.state.personajes[i * 5 + 1]} />
            <svg viewBox="0 0 21 21">
              <polyline points="5 10.75 8.5 14.25 16 6"></polyline>
            </svg>
          </label>
        </div>,
        <div>
          <label className="checkbox bounce">
            <input type="checkbox" id={"checkbox2" + (i * 5 + 2)} name={this.state.personajes[i * 5]} value={this.state.personajes[i * 5 + 2]} defaultChecked={this.state.personajes[i * 5 + 2]} />
            <svg viewBox="0 0 21 21">
              <polyline points="5 10.75 8.5 14.25 16 6"></polyline>
            </svg>
          </label>
        </div>
          ,
        <div>
          <label className="checkbox bounce">
            <input type="checkbox" id={"checkbox3" + (i * 5 + 3)} name={this.state.personajes[i * 5]} value={this.state.personajes[i * 5 + 3]} defaultChecked={this.state.personajes[i * 5 + 3]} />
            <svg viewBox="0 0 21 21">
              <polyline points="5 10.75 8.5 14.25 16 6"></polyline>
            </svg>
          </label>
        </div>
          ,
        <div>
          <label className="checkbox bounce">
            <input type="checkbox" id={"checkbox4" + (i * 5 + 4)} name={this.state.personajes[i * 5]} value={this.state.personajes[i * 5 + 4]} defaultChecked={this.state.personajes[i * 5 + 4]} />
            <svg viewBox="0 0 21 21">
              <polyline points="5 10.75 8.5 14.25 16 6"></polyline>
            </svg>
          </label>
        </div>
        ])
        )
      }
      else {
        this.state.rowsPnjs.push(createData(i, ...[this.nombre(this.state.personajes[i * 5]),
        <div>

          <label className="checkbox bounce">
            <input type="checkbox" id={"checkbox1" + (i * 5 + 1)} name={this.state.personajes[i * 5]} value={this.state.personajes[i * 5 + 1]} defaultChecked={this.state.personajes[i * 5 + 1]} />
            <svg viewBox="0 0 21 21">
              <polyline points="5 10.75 8.5 14.25 16 6"></polyline>
            </svg>
          </label>
        </div>,
        <div>
          <label className="checkbox bounce">
            <input type="checkbox" id={"checkbox2" + (i * 5 + 2)} name={this.state.personajes[i * 5]} value={this.state.personajes[i * 5 + 2]} defaultChecked={this.state.personajes[i * 5 + 2]} />
            <svg viewBox="0 0 21 21">
              <polyline points="5 10.75 8.5 14.25 16 6"></polyline>
            </svg>
          </label>
        </div>
          ,
        <div>
          <label className="checkbox bounce">
            <input type="checkbox" id={"checkbox3" + (i * 5 + 3)} name={this.state.personajes[i * 5]} value={this.state.personajes[i * 5 + 3]} defaultChecked={this.state.personajes[i * 5 + 3]} />
            <svg viewBox="0 0 21 21">
              <polyline points="5 10.75 8.5 14.25 16 6"></polyline>
            </svg>
          </label>
        </div>
          ,
        <div>
          <label className="checkbox bounce">
            <input type="checkbox" id={"checkbox4" + (i * 5 + 4)} name={this.state.personajes[i * 5]} value={this.state.personajes[i * 5 + 4]} defaultChecked={this.state.personajes[i * 5 + 4]} />
            <svg viewBox="0 0 21 21">
              <polyline points="5 10.75 8.5 14.25 16 6"></polyline>
            </svg>
          </label>
        </div>
        ])
        )
      }

    }

    this.setState({ carga: 1 })
  };



  async handleSubmit(event) {

    var a = [];

    for (let i = 0; i < ((event.target).length - 1) / 4; i++) {


      if (event.target[i].type === "checkbox")

        a.push(parseInt(event.target[4 * i].name));
      for (let j = 0; j < 4; j++) {
        a.push(event.target[4 * i + j].checked);

      }
    }

    event.preventDefault();
    this.props.cerrar();
    EscenaService.fijardestinatarios(a, this.props.escena);

  }



  render() {
    return (
      <div>
        {this.state.carga &&
          <form onSubmit={this.handleSubmit}>
              <div onClick={() => this.setState({ mostrarPjs: !this.state.mostrarPjs })}>
                <p>Personajes jugadores {this.state.mostrarPjs? "⇭" : "⤋" }</p>
              </div>
              {this.state.mostrarPjs &&

            <Paper style={{ height: (this.state.rows.length+1)*50, width: '100%' }}>

            

                <VirtualizedTable
                  rowCount={this.state.rows.length}
                  rowGetter={({ index }) => this.state.rows[index]}
                  columns={[
                    {
                      width: 200,
                      label: 'Personaje',
                      dataKey: 'nombre',
                    },
                    {
                      width: 120,
                      label: 'Leer',
                      dataKey: 'leer',
                      numeric: true,
                    },
                    {
                      width: 120,
                      label: 'Escribir',
                      dataKey: 'escribir',
                      numeric: true,
                    },
                    {
                      width: 120,
                      label: 'Por defecto',
                      dataKey: 'defecto',
                      numeric: true,
                    },
                    {
                      width: 120,
                      label: 'Oculto',
                      dataKey: 'oculto',
                      numeric: true,
                    },
                  ]}
                />

              
            </Paper>
            }
            <p></p>
            <div onClick={() => this.setState({ mostrarPnjs: !this.state.mostrarPnjs })}>
                <p>Personajes no jugadores {this.state.mostrarPnjs? "⇭" : "⤋" }</p>
              </div>

            {this.state.mostrarPnjs &&
            
            <Paper style={{ height: (this.state.rowsPnjs.length+1)*50, width: '100%' }}>

             
                <VirtualizedTable
                  rowCount={this.state.rowsPnjs.length}
                  rowGetter={({ index }) => this.state.rowsPnjs[index]}
                  columns={[
                    {
                      width: 200,
                      label: 'Personaje',
                      dataKey: 'nombre',
                    },
                    {
                      width: 120,
                      label: 'Leer',
                      dataKey: 'leer',
                      numeric: true,
                    },
                    {
                      width: 120,
                      label: 'Escribir',
                      dataKey: 'escribir',
                      numeric: true,
                    },
                    {
                      width: 120,
                      label: 'Por defecto',
                      dataKey: 'defecto',
                      numeric: true,
                    },
                    {
                      width: 120,
                      label: 'Oculto',
                      dataKey: 'oculto',
                      numeric: true,
                    },
                  ]}
                />

              
            </Paper>
            }
            <button type="submit">Guardar</button>

          </form>
        }

      </div>
    );
  }
}

