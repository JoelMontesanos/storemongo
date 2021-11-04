import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, param, patch, post, put, requestBody,
  response
} from '@loopback/rest';
import {Ticket} from '../models';
import {TicketRepository} from '../repositories';
export class TicketController {
  constructor(
    @repository(TicketRepository)
    public ticketRepository: TicketRepository,
  ) { }


  @get('/tickets/descuentos/{montoTotal}&{metodo_pago}&{cupon}&{zona}&{envio}')
  async Descuentos(
    @param.path.number('montoTotal') montoTotal: number,
    @param.path.string('metodo_pago') metodo_pago: string,
    @param.path.string('cupon') cupon: string,
    @param.path.number('zona') zona: number,
    @param.path.number('envio') envio: number,
  ): Promise<any> {
    var metodo_pago = metodo_pago;
    var cupon = cupon;
    var zona = zona;
    var montoFinal = 0;
    var montoTotal = montoTotal;
    var envio = envio;
    var descuento = 0;

    switch (cupon) {
      case 'MASTER20':
        if (zona == 1 || zona == 2) {
          if (metodo_pago == 'paypal') {
            montoFinal = (montoTotal - ((montoTotal + envio) * .15));
            descuento = ((montoTotal + envio) * .15);
          }
          if (metodo_pago == 'mastercard') {
            montoFinal = (montoTotal - ((montoTotal + envio) * .20));
            descuento = ((montoTotal + envio) * .20);
          }
        };
        return {montoFinal: montoFinal, descuento: descuento};

      case 'PERRITOFELI':
        if (zona == 1 || zona == 2 || zona == 3) {
          if (metodo_pago == 'visa' || metodo_pago == 'mastercard') {
            montoFinal = montoTotal + (envio - (envio * .15));
            descuento = (envio - (envio * .15));
          }
        };
        return {montoFinal: montoFinal, descuento: descuento};

      case 'NOJADO':
        if (zona == 4 || zona == 5) {
          montoFinal = montoTotal + (envio - (envio * .10));
          descuento = (envio - (envio * .10));
        };
        return {montoFinal: montoFinal, descuento: descuento};

      case 'default':
        if (zona == 5) {
          if (metodo_pago == 'mastercard') {
            montoFinal = (montoTotal - ((montoTotal + envio) * .10));
            descuento = ((montoTotal + envio) * .10);
          }
        }
        if (zona == 4) {
          if (metodo_pago == 'mastercard' && montoTotal >= 3000) {
            montoFinal = montoTotal;
            descuento = envio;
          } else {
            montoFinal = montoTotal + envio;
            descuento = 0;
          }
        }
        if (zona == 3) {
          if (metodo_pago == 'visa' && montoTotal >= 4000) {
            montoFinal = (montoTotal - ((montoTotal + envio) * .15));
            descuento = ((montoTotal + envio) * .15);
          }
        }
        return {montoFinal: montoFinal, descuento: descuento};
    }
  }



  @post('/tickets')
  @response(200, {
    description: 'Ticket model instance',
    content: {'application/json': {schema: getModelSchemaRef(Ticket)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Ticket, {
            title: 'NewTicket',
            exclude: ['id'],
          }),
        },
      },
    })
    ticket: Omit<Ticket, 'id'>,
  ): Promise<Ticket> {
    return this.ticketRepository.create(ticket);
  }

  @get('/tickets/count')
  @response(200, {
    description: 'Ticket model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Ticket) where?: Where<Ticket>,
  ): Promise<Count> {
    return this.ticketRepository.count(where);
  }

  @get('/tickets')
  @response(200, {
    description: 'Array of Ticket model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Ticket, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Ticket) filter?: Filter<Ticket>,
  ): Promise<Ticket[]> {
    return this.ticketRepository.find(filter);
  }





  @patch('/tickets')
  @response(200, {
    description: 'Ticket PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Ticket, {partial: true}),
        },
      },
    })
    ticket: Ticket,
    @param.where(Ticket) where?: Where<Ticket>,
  ): Promise<Count> {
    return this.ticketRepository.updateAll(ticket, where);
  }

  @get('/tickets/{id}')
  @response(200, {
    description: 'Ticket model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Ticket, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Ticket, {exclude: 'where'}) filter?: FilterExcludingWhere<Ticket>
  ): Promise<Ticket> {
    return this.ticketRepository.findById(id, filter);
  }

  @patch('/tickets/{id}')
  @response(204, {
    description: 'Ticket PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Ticket, {partial: true}),
        },
      },
    })
    ticket: Ticket,
  ): Promise<void> {
    await this.ticketRepository.updateById(id, ticket);
  }

  @put('/tickets/{id}')
  @response(204, {
    description: 'Ticket PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() ticket: Ticket,
  ): Promise<void> {
    await this.ticketRepository.replaceById(id, ticket);
  }

  @del('/tickets/{id}')
  @response(204, {
    description: 'Ticket DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.ticketRepository.deleteById(id);
  }
}
