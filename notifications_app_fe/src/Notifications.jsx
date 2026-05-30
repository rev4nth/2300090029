import { useEffect, useState } from 'react';
import { getEvaluationNotificationsApi } from './api/evaluationApi';
import { logError } from './logs';

const types = ['Event', 'Result', 'Placement'];

const priority = {
  Placement: 'High',
  Result: 'Medium',
  Event: 'Low',
};

const ordr = {
  Placement: 1,
  Result: 2,
  Event: 3,
};

export default function Notifications() {
  const [notifcations, setNotifcations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [typeFilter, setTypeFilter] = useState('ALL');

  async function loadData() {
    setLoading(true);
    setErrMsg('');

    try {
      let list = [];

      if (typeFilter === 'ALL') {
        for (let i = 0; i < types.length; i++) {
          const res = await getEvaluationNotificationsApi({
            limit,
            page,
            notification_type: types[i],
          });

          const items = res.data.notifications || [];
          list = list.concat(items);
        }
      } else {
        const res = await getEvaluationNotificationsApi({
          limit,
          page,
          notification_type: typeFilter,
        });

        list = res.data.notifications || [];
      }

      list.sort((a, b) => {
        const oa = ordr[a.Type] || 99;
        const ob = ordr[b.Type] || 99;

        if (oa !== ob) {
          return oa - ob;
        }

        return new Date(b.Timestamp) - new Date(a.Timestamp);
      });

      setNotifcations(list);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        'Failed to loading notifications';

      setErrMsg(msg);
      setNotifcations([]);
      logError('page', msg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [page, limit, typeFilter]);

  return (
    <div>
      <h1>Notifications</h1>

      <div>
        <label>
          Type{' '}
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="ALL">All</option>
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>

        <label style={{ marginLeft: '10px' }}>
          Limit{' '}
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </label>

        <button
          type="button"
          onClick={loadData}
          disabled={loading}
          style={{ marginLeft: '10px' }}
        >
          Refresh
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {errMsg && <p>{errMsg}</p>}

      {!loading && notifcations.length === 0 && !errMsg && (
        <p>No notifications</p>
      )}

      {notifcations.length > 0 && (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Priority</th>
              <th>Type</th>
              <th>Message</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {notifcations.map((n) => (
              <tr key={n.ID}>
                <td>{priority[n.Type] || '-'}</td>
                <td>{n.Type}</td>
                <td>{n.Message}</td>
                <td>{n.Timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div style={{ marginTop: '10px' }}>
        <button
          type="button"
          onClick={() => setPage((p) => p - 1)}
          disabled={page <= 1 || loading}
        >
          Previous
        </button>

        <span style={{ margin: '0 10px' }}>
          Page {page}
        </span>

        <button
          type="button"
          onClick={() => setPage((p) => p + 1)}
          disabled={loading}
        >
          Next
        </button>
      </div>
    </div>
  );
}