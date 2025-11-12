from typing import Optional
from src.core.entities.product import Product
from src.core.exceptions import ProductNotFound
from src.core.interfaces.product_repository import ProductRepository
from src.core.interfaces.usecase_interface import UseCase

class UpdateProductUseCase(UseCase):

    def __init__(self, repository: ProductRepository):
        self._repository = repository

    def execute(
        self,
        nome_atual: str,
        novo_nome: Optional[str],
        quantidade: Optional[int],
        valor: Optional[float],
    ) -> Product:
        product = self._repository.get_by_name(nome_atual)
        if not product:
            raise ProductNotFound(f"Produto com nome={nome_atual} não encontrado.")

        if novo_nome is not None and novo_nome != "":
            product.nome = novo_nome
        if quantidade is not None:
            product.quantidade = quantidade
        if valor is not None:
            product.valor = valor

        return self._repository.update(nome_atual, product)