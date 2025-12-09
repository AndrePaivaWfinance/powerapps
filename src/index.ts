import { IInputs, IOutputs } from "./generated/ManifestTypes";
import Chart from "chart.js/auto";

export class DashboardFinanceiro implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    private container: HTMLDivElement;
    private chart: Chart | null = null;

    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary,
        container: HTMLDivElement
    ) {
        this.container = container;
        this.render(context);
    }

    private render(context: ComponentFramework.Context<IInputs>) {

        const saldo = context.parameters.Saldo.raw || 0;
        const receita = context.parameters.Receita.raw || 0;
        const despesa = context.parameters.Despesa.raw || 0;

        this.container.innerHTML = `
            <div class="dashboard">
                
                <div class="topbar">
                    <div class="logo">WFinance</div>
                    <div class="saldo">R$ ${saldo.toLocaleString()}</div>
                </div>

                <div class="cards">
                    <div class="card green">
                        <h3>Receitas</h3>
                        <p>R$ ${receita.toLocaleString()}</p>
                    </div>

                    <div class="card red">
                        <h3>Despesas</h3>
                        <p>R$ ${despesa.toLocaleString()}</p>
                    </div>

                    <div class="card blue">
                        <h3>Resultado</h3>
                        <p>R$ ${(receita - despesa).toLocaleString()}</p>
                    </div>
                </div>

                <div class="grafico">
                    <canvas id="fluxoCanvas"></canvas>
                </div>
            </div>
        `;

        this.renderChart(receita, despesa);
    }

    private renderChart(receita: number, despesa: number) {

        // Limpando gráfico anterior
        if (this.chart) {
            this.chart.destroy();
        }

        // Canvas dentro do container (PCF não permite usar document)
        const canvas = this.container.querySelector("#fluxoCanvas") as HTMLCanvasElement;
        if (!canvas) return;

        this.chart = new Chart(canvas, {
            type: "bar",
            data: {
                labels: ["Receita", "Despesa"],
                datasets: [{
                    label: "Fluxo Financeiro",
                    data: [receita, despesa],
                    backgroundColor: ["#2EA44F", "#D73A49"]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    public updateView(context: ComponentFramework.Context<IInputs>): void {
        this.render(context);
    }

    public getOutputs(): IOutputs {
        return {};
    }

    public destroy(): void {
        if (this.chart) this.chart.destroy();
    }
}
