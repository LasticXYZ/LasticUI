import Border from '@/components/border/Border';
import GeneralTable from '@/components/table/GeneralTable';
import WalletStatus from '@/components/walletStatus/WalletStatus';
import { WorkplanAssignmentInfo, WorkplanAssignmentInfoUnf, WorkplanCoreInfo, WorkplanType } from '@/types';
import { parseFormattedNumber } from '@/utils';
import { useInkathon } from '@poppyseed/lastic-sdk';
import { useEffect, useState } from 'react';

// Custom hook for querying and transforming workplan data
const useWorkplanQuery = () => {
    const { api } = useInkathon();
    const [data, setData] = useState<WorkplanType | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!api?.query?.broker?.workplan) return;
            try {
                const entries = await api.query.broker.workplan.entries();
                const workplan: WorkplanType = entries.map(([key, value]) => {
                    const coreInfoUnf: string[] = key.toHuman() as string[];
                    const coreInfo: WorkplanCoreInfo = coreInfoUnf.length > 0 && coreInfoUnf[0].length > 1 ? {
                        begin: parseFormattedNumber(coreInfoUnf[0][0]),
                        core: parseFormattedNumber(coreInfoUnf[0][1]),
                    } : { core: 0, begin: 0 };

                    const assignmentInfo: WorkplanAssignmentInfo[] = (value.toHuman() as WorkplanAssignmentInfoUnf[]).map(info => ({
                        ...info,
                        assignment: typeof info.assignment === 'object' ? { Task: parseFormattedNumber(info.assignment.Task) } : 'Pool',
                    }));

                    return { coreInfo, assignmentInfo };
                });
                setData(workplan);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            }
        };

        fetchData();
        const intervalId = setInterval(fetchData, 5000);
        return () => clearInterval(intervalId);
    }, [api]);

    return data;
};

const MyCores = () => {
    const { activeAccount, activeChain } = useInkathon();
    const workplanData = useWorkplanQuery();
    const [filter, setFilter] = useState('all');
    const [task, setTask] = useState<number | null>(null);
    const [core, setCore] = useState<number | null>(null);
    const [begin, setBegin] = useState<number | null>(null);

    // Data filtering based on user selection
    const filteredData = workplanData?.filter(plan => {
        if (filter === 'pool') return plan.assignmentInfo.some(info => info.assignment === 'Pool');
        if (filter === 'tasks') return plan.assignmentInfo.some(info => typeof info.assignment !== 'string');
        return true; // 'all' or other cases
    }).filter(plan => {
        return (!task || plan.assignmentInfo.some(info => typeof info.assignment === 'object' && info.assignment.Task === task)) &&
               (!core || plan.coreInfo.core === core) &&
               (!begin || plan.coreInfo.begin === begin);
    });

    if (!activeAccount || !activeChain) {
        return (
            <Border className="h-full flex flex-row justify-center items-center">
                <WalletStatus />
            </Border>
        );
    }

    return (
        <Border className="h-full flex flex-row justify-center items-center">
            <div className="h-full w-full flex flex-col justify-start items-start p-10">
                <h1 className="text-xl font-bold uppercase mb-5">Cores set for execution</h1>
                <div className='flex flex-row items-center gap-3 mb-5'>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="p-2 border rounded"
                    >
                        <option value="all">All</option>
                        <option value="tasks">Tasks</option>
                        <option value="pool">Pool</option>
                    </select>
                    {filter === 'tasks' && (
                        <>
                            <label htmlFor="task">Task:</label>
                            <input
                                id="task"
                                type="number"
                                placeholder="Task Number"
                                value={task || ''}
                                onChange={(e) => setTask(parseFloat(e.target.value) || null)}
                                className="ml-2 p-2 border rounded"
                            />
                        </>
                    )}
                    <label htmlFor="begin">Begin:</label>
                    <input
                        id="begin"
                        type="number"
                        placeholder="Begin Number"
                        value={begin || ''}
                        onChange={(e) => setBegin(parseFloat(e.target.value) || null)}
                        className="p-2 border rounded"
                    />
                    <label htmlFor="core">Core:</label>
                    <input
                        id="core"
                        type="number"
                        placeholder="Core Number"
                        value={core || ''}
                        onChange={(e) => setCore(parseFloat(e.target.value) || null)}
                        className="p-2 border rounded"
                    />
                </div>
                {filteredData && filteredData.length > 0 ? (
                  <div className="w-full overflow-x-auto">
                    <GeneralTable
                        tableData={filteredData.map(({ coreInfo, assignmentInfo }) => ({
                            data: [
                                assignmentInfo[0]?.assignment !== 'Pool' && typeof assignmentInfo[0]?.assignment === 'object' ? assignmentInfo[0].assignment.Task.toString() : 'Pool',
                                coreInfo.begin.toString(),
                                coreInfo.core.toString(),
                                assignmentInfo[0]?.mask || 'N/A',
                            ],
                        }))}
                        tableHeader={[
                            { title: 'Task' },
                            { title: 'Begin' },
                            { title: 'Core' },
                            { title: 'Mask' },
                        ]}
                        colClass="grid-cols-4"
                    />
                  </div>
                ) : (
                    <p>No data available.</p>
                )}
            </div>
        </Border>
    );
};

export default MyCores;
