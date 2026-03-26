from pathlib import Path
import sys

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from main import health_check


@pytest.mark.anyio
async def test_health_check_returns_ok_status() -> None:
    response = await health_check()

    assert response["status"] == "ok"
    assert "message" in response
