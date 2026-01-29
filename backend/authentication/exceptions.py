"""
Exception handler customizado para DRF
"""

from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status


def custom_exception_handler(exc, context):
    """
    Handler customizado para exceções do DRF
    Retorna respostas no formato padrão do projeto
    """
    # Chama o handler padrão primeiro
    response = exception_handler(exc, context)

    if response is not None:
        # Customiza formato da resposta
        custom_response_data = {
            'error': True,
            'message': None,
            'details': None
        }

        # Extrai mensagem de erro
        if isinstance(response.data, dict):
            # Se tem 'detail', usa como mensagem principal
            if 'detail' in response.data:
                custom_response_data['message'] = str(response.data['detail'])
            else:
                # Caso contrário, pega a primeira mensagem encontrada
                for key, value in response.data.items():
                    if isinstance(value, list) and len(value) > 0:
                        custom_response_data['message'] = str(value[0])
                    else:
                        custom_response_data['message'] = str(value)
                    break

            # Guarda detalhes completos
            custom_response_data['details'] = response.data
        else:
            custom_response_data['message'] = str(response.data)

        response.data = custom_response_data

    return response