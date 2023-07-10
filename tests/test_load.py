import pytest

from girder.plugin import loadedPlugins


@pytest.mark.plugin('dsa_keycloak_javascript_adapter')
def test_import(server):
    assert 'dsa_keycloak_javascript_adapter' in loadedPlugins()
