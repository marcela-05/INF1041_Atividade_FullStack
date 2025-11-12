import pytest
from src.core.entities.product import Product
from src.core.exceptions import ProductNotFound
from src.core.interfaces.product_repository import ProductRepository
from src.core.use_cases.update_product import UpdateProductUseCase


class MutableProductRepository(ProductRepository):
    def __init__(self, products):
        self._products = products

    def add(self, product):  # pragma: no cover
        raise NotImplementedError

    def list_all(self):  # pragma: no cover
        return list(self._products)

    def get_by_id(self, product_id):  # pragma: no cover
        raise NotImplementedError

    def get_by_name(self, name):
        for p in self._products:
            if p.nome == name:
                return p
        return None

    def delete_by_name(self, name):  # pragma: no cover
        raise NotImplementedError

    def update(self, nome_antigo, product):
        for i, p in enumerate(self._products):
            if p is product or p.nome == nome_antigo:
                self._products[i] = product
                return product
        raise ProductNotFound(f"Produto com nome={nome_antigo} não encontrado.")


    def add_comment(self, product_id, comment):  # pragma: no cover
        raise NotImplementedError


def test_update_produto_existente():
    repo = MutableProductRepository(
        [Product(nome="Arroz", quantidade=2, valor=10.5, id=1)]
    )
    use_case = UpdateProductUseCase(repo)

    novo = use_case.execute(
        nome_atual="Arroz",
        novo_nome="Arroz integral",
        quantidade=5,
        valor=12.0,
    )

    assert novo.nome == "Arroz integral"
    assert novo.quantidade == 5
    assert novo.valor == 12.0
    assert repo.list_all()[0] == novo


def test_update_produto_inexistente():
    repo = MutableProductRepository([])
    use_case = UpdateProductUseCase(repo)

    with pytest.raises(ProductNotFound):
        use_case.execute(
            nome_atual="Arroz",
            novo_nome="Arroz integral",
            quantidade=5,
            valor=12.0,
        )


def test_update_so_campos_enviados():
    repo = MutableProductRepository(
        [Product(nome="Arroz", quantidade=2, valor=10.5, id=1)]
    )
    use_case = UpdateProductUseCase(repo)

    atualizado = use_case.execute(
        nome_atual="Arroz",
        novo_nome=None,
        quantidade=10, 
        valor=None,  
    )

    assert atualizado.nome == "Arroz"
    assert atualizado.quantidade == 10
    assert atualizado.valor == 10.5
