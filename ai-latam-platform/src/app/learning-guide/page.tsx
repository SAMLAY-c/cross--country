import Link from "next/link";
import Nav from "@/components/nav";

export default function LearningGuide() {
  return (
    <div
      className="min-h-screen bg-[#0a0a0a] text-[#a1a1aa] [font-family:var(--font-eco)]"
      style={{
        ["--accent" as unknown as string]: "#d4ff00",
        ["--accent-glow" as unknown as string]: "rgba(212,255,0,0.35)",
        ["--accent-contrast" as unknown as string]: "#0a0a0a",
      }}
    >
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(212,255,0,0.12),transparent_60%),radial-gradient(circle_at_15%_10%,rgba(0,255,148,0.12),transparent_55%),radial-gradient(circle_at_85%_25%,rgba(120,200,255,0.12),transparent_45%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(10,10,10,0.2),rgba(0,0,0,0.7))]" />
        <div className="absolute inset-0 bg-[url('/eco-hero.svg')] bg-cover bg-center opacity-35 grayscale" />
        <div className="brightness-overlay absolute inset-0 bg-white mix-blend-soft-light pointer-events-none" />

        <main className="relative w-full flex min-h-screen flex-col px-8 pb-20 pt-10 sm:px-12 lg:px-20">
          <Nav currentPath="/learning-guide" />

          <div className="mt-12 space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/60">
              LEARNING GUIDE
            </p>
            <h1 className="text-5xl font-extrabold leading-[1.05] sm:text-6xl lg:text-7xl [font-family:var(--font-display)] text-transparent bg-clip-text bg-[linear-gradient(180deg,#ffffff_0%,#b4bcbc_100%)]">
              AI Agent <span className="text-[var(--accent)]">学习路线</span>
            </h1>
            <p className="max-w-3xl text-lg text-white/60 leading-relaxed">
              从入门到精通，系统化学习 AI Agent 开发。摆脱那些只会教你调 API 的速成课，
              掌握真正能落地的实战能力。
            </p>
          </div>

          {/* 第一阶段 */}
          <section className="mt-20 space-y-8">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--accent-contrast)] font-bold text-xl">
                1
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">打好地基</h2>
                <p className="text-sm text-white/50">建立对 LLM 的扎实体感</p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-2xl bg-[#121212] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
                <h3 className="text-xl font-semibold text-[var(--accent)]">Prompt Engineering</h3>
                <p className="mt-3 text-sm text-white/70 leading-relaxed">
                  不是玄学，是一门手艺。掌握 Few-shot、Chain-of-Thought、Self-Consistency 这些基本功。
                </p>
                <ul className="mt-4 space-y-2 text-xs text-white/60">
                  <li>• 吴恩达 & OpenAI 官方合作短课</li>
                  <li>• 《ChatGPT Prompt Engineering for Developers》</li>
                  <li>• 花一下午就能过完，建立基本认知</li>
                </ul>
              </div>

              <div className="rounded-2xl bg-[#121212] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
                <h3 className="text-xl font-semibold text-[var(--accent)]">RAG 检索增强生成</h3>
                <p className="mt-3 text-sm text-white/70 leading-relaxed">
                  90% 以上 Agent 应用的核心。文档加载、切分、向量化、存储、检索全流程。
                </p>
                <ul className="mt-4 space-y-2 text-xs text-white/60">
                  <li>• 文本切分策略：固定长度 vs 语义切分</li>
                  <li>• 向量检索、混合检索、重排(Rerank)</li>
                  <li>• 推荐资源：字节 6 万字 RAG 实践手册</li>
                </ul>
              </div>

              <div className="rounded-2xl bg-[#121212] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
                <h3 className="text-xl font-semibold text-[var(--accent)]">Fine-tuning 微调</h3>
                <p className="mt-3 text-sm text-white/70 leading-relaxed">
                  知道什么时候该用微调，什么时候不该用。多数情况下，好的 RAG 系统比草率的微调效果好得多。
                </p>
                <ul className="mt-4 space-y-2 text-xs text-white/60">
                  <li>• SFT、ReFT、Adapter、LoRA 方法</li>
                  <li>• 低资源和零资源场景策略</li>
                  <li>• 推荐资源：字节大模型微调实践手册</li>
                </ul>
              </div>
            </div>

            <div className="rounded-2xl bg-[#121212] border-2 border-[var(--accent)]/30 p-6">
              <h4 className="text-lg font-semibold text-white">🎯 第一阶段目标</h4>
              <p className="mt-3 text-sm text-white/70 leading-relaxed">
                能不依赖任何框架，手撸一个简单的 RAG 问答机器人。用 OpenAI 的 API，自己用 FAISS 或 Chroma 建个向量库，
                自己管理 prompt，跑通整个流程。
              </p>
            </div>
          </section>

          {/* 第二阶段 */}
          <section className="mt-20 space-y-8">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--accent-contrast)] font-bold text-xl">
                2
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">让框架成为趁手的工具</h2>
                <p className="text-sm text-white/50">理解框架设计哲学，而不是背 API</p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl bg-[#121212] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
                <h3 className="text-xl font-semibold text-[var(--accent)]">LangChain</h3>
                <p className="mt-3 text-sm text-white/70 leading-relaxed">
                  大杂烩，什么都有。生态好，但封装太深像个黑箱。
                </p>
                <div className="mt-4 space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-white/80 uppercase tracking-wider">✅ 推荐用法</p>
                    <p className="mt-1 text-xs text-white/60">文档加载器、文本切分器等组件库</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white/80 uppercase tracking-wider">⚠️ 谨慎使用</p>
                    <p className="mt-1 text-xs text-white/60">核心 Agent 逻辑建议自己写，完全掌控流程</p>
                  </div>
                </div>
                <p className="mt-4 text-xs text-white/50">
                  💡 源码值得一读，会发现很多"神奇"功能底层实现其实很简单
                </p>
              </div>

              <div className="rounded-2xl bg-[#121212] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
                <h3 className="text-xl font-semibold text-[var(--accent)]">LlamaIndex</h3>
                <p className="mt-3 text-sm text-white/70 leading-relaxed">
                  专注于 RAG，比 LangChain 更深入、更专业。
                </p>
                <ul className="mt-4 space-y-2 text-xs text-white/60">
                  <li>• 精巧的数据结构和索引策略</li>
                  <li>• 强大的查询引擎</li>
                  <li>• 重度依赖知识库查询的最佳选择</li>
                </ul>
              </div>

              <div className="rounded-2xl bg-[#121212] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
                <h3 className="text-xl font-semibold text-[var(--accent)]">AutoGen (微软)</h3>
                <p className="mt-3 text-sm text-white/70 leading-relaxed">
                  专注于多 Agent 协作，让不同的 Agent 扮演不同角色来完成复杂任务。
                </p>
              </div>

              <div className="rounded-2xl bg-[#121212] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
                <h3 className="text-xl font-semibold text-[var(--accent)]">CrewAI</h3>
                <p className="mt-3 text-sm text-white/70 leading-relaxed">
                  在 AutoGen 基础上提供更结构化的框架来定义 Agent 和任务。
                </p>
                <p className="mt-3 text-xs text-white/50">
                  💡 别贪多，先精通一个
                </p>
              </div>
            </div>
          </section>

          {/* 第三阶段 */}
          <section className="mt-20 space-y-8">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--accent-contrast)] font-bold text-xl">
                3
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">从"能跑"到"能用"</h2>
                <p className="text-sm text-white/50">这才是真正的鸿沟</p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl bg-[#121212] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
                <h3 className="text-xl font-semibold text-[var(--accent)]">📊 评估 Evaluation</h3>
                <p className="mt-3 text-sm text-white/70 leading-relaxed">
                  最重要也最头疼的一环。怎么知道你的 Agent 做得好不好？
                </p>
                <ul className="mt-4 space-y-2 text-xs text-white/60">
                  <li>• 建立评估集（上百个真实问题+标准答案）</li>
                  <li>• 使用 RAGAS、ARES 框架打分</li>
                  <li>• 维度：相关性、准确性、上下文召回率</li>
                  <li>• 数据驱动改进，而不是凭感觉</li>
                </ul>
                <div className="mt-4 rounded-lg bg-[#1a1a1a] p-3 text-xs text-white/70">
                  ⚠️ 任何不谈评估的 Agent 开发，都是自娱自乐
                </div>
              </div>

              <div className="rounded-2xl bg-[#121212] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
                <h3 className="text-xl font-semibold text-[var(--accent)]">🔍 可观测性 Observability</h3>
                <p className="mt-3 text-sm text-white/70 leading-relaxed">
                  LLM 的输出是不确定的，需要能追溯错误来源。
                </p>
                <ul className="mt-4 space-y-2 text-xs text-white/60">
                  <li>• LangSmith：记录每一步思考链</li>
                  <li>• 工具调用、LLM 输入输出全记录</li>
                  <li>• 方便复盘和调试</li>
                </ul>
                <p className="mt-4 text-xs text-white/50">
                  问题可能是：知识库检索失败？Prompt 歧义？还是 LLM 幻觉？
                </p>
              </div>

              <div className="rounded-2xl bg-[#121212] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.4)] md:col-span-2">
                <h3 className="text-xl font-semibold text-[var(--accent)]">🛡️ 稳定性与成本控制</h3>
                <p className="mt-3 text-sm text-white/70 leading-relaxed">
                  Agent 可能会陷入无限循环，或者调用昂贵的工具/API。工程上必须考虑的问题。
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-lg bg-[#1a1a1a] p-4">
                    <p className="text-sm font-semibold text-white">熔断机制</p>
                    <p className="mt-2 text-xs text-white/60">防止无限循环和资源耗尽</p>
                  </div>
                  <div className="rounded-lg bg-[#1a1a1a] p-4">
                    <p className="text-sm font-semibold text-white">Token 监控</p>
                    <p className="mt-2 text-xs text-white/60">实时追踪消耗，控制成本</p>
                  </div>
                  <div className="rounded-lg bg-[#1a1a1a] p-4">
                    <p className="text-sm font-semibold text-white">错误处理</p>
                    <p className="mt-2 text-xs text-white/60">优雅降级和重试策略</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 学习资源 */}
          <section className="mt-20 space-y-8">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/60">
                RESOURCES
              </p>
              <h2 className="text-4xl font-extrabold leading-tight sm:text-5xl [font-family:var(--font-display)]">
                <span className="text-[var(--accent)]">靠谱资源</span>推荐
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl bg-[#121212] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--accent)]">
                  基础入门
                </p>
                <h3 className="mt-4 text-lg font-semibold text-white">建立体感</h3>
                <ul className="mt-4 space-y-3 text-xs text-white/70">
                  <li className="flex gap-2">
                    <span className="text-[var(--accent)]">•</span>
                    <span>吴恩达 DeepLearning.AI 短课系列</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[var(--accent)]">•</span>
                    <span>Lilian Weng 的博客《LLM Powered Autonomous Agents》</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[var(--accent)]">•</span>
                    <span>OpenAI 官方文档</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl bg-[#121212] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--accent)]">
                  进阶实战
                </p>
                <h3 className="mt-4 text-lg font-semibold text-white">深入框架</h3>
                <ul className="mt-4 space-y-3 text-xs text-white/70">
                  <li className="flex gap-2">
                    <span className="text-[var(--accent)]">•</span>
                    <span>LangChain 和 LlamaIndex 官方文档</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[var(--accent)]">•</span>
                    <span>源代码：Cmd+B 点进去看实现</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[var(--accent)]">•</span>
                    <span>官方 Cookbook 和 API Reference</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl bg-[#121212] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--accent)]">
                  高手之路
                </p>
                <h3 className="mt-4 text-lg font-semibold text-white">系统思维</h3>
                <ul className="mt-4 space-y-3 text-xs text-white/70">
                  <li className="flex gap-2">
                    <span className="text-[var(--accent)]">•</span>
                    <span>Full Stack LLM Bootcamp</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[var(--accent)]">•</span>
                    <span>arXiv 论文：ReAct、CoT、ToT</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-[var(--accent)]">•</span>
                    <span>OpenAI、A16Z、Lilian Weng 的博客</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="rounded-2xl bg-[#121212] border border-[var(--accent)]/30 p-6">
              <h3 className="text-lg font-semibold text-white">📚 字节内部实践手册</h3>
              <p className="mt-3 text-sm text-white/70 leading-relaxed">
                覆盖 Agent 从底层技术（大模型、工具调用、API 集成、架构设计）到各种泛业务场景的全链路案例。
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg bg-[#1a1a1a] p-3">
                  <p className="text-xs font-semibold text-[var(--accent)]">飞书智能办公</p>
                  <p className="mt-1 text-xs text-white/60">自动排会、生成会议纪要</p>
                </div>
                <div className="rounded-lg bg-[#1a1a1a] p-3">
                  <p className="text-xs font-semibold text-[var(--accent)]">抖音电商</p>
                  <p className="mt-1 text-xs text-white/60">库存监控、智能客服、定价优化</p>
                </div>
                <div className="rounded-lg bg-[#1a1a1a] p-3">
                  <p className="text-xs font-semibold text-[var(--accent)]">内容创作</p>
                  <p className="mt-1 text-xs text-white/60">辅助构思脚本和选素材</p>
                </div>
                <div className="rounded-lg bg-[#1a1a1a] p-3">
                  <p className="text-xs font-semibold text-[var(--accent)]">教育场景</p>
                  <p className="mt-1 text-xs text-white/60">定制学习计划和实时答疑</p>
                </div>
              </div>
            </div>
          </section>

          {/* 总结 */}
          <section className="mt-20">
            <div className="rounded-2xl bg-gradient-to-br from-[#121212] to-[#0d0d0d] p-8 shadow-[0_30px_70px_rgba(0,0,0,0.5)]">
              <h2 className="text-2xl font-bold text-white">💡 核心观点</h2>
              <div className="mt-6 space-y-4 text-sm text-white/70 leading-relaxed">
                <p>
                  <span className="text-[var(--accent)] font-semibold">别再浪费时间找"高质量课程"了</span>，
                  尤其是那种成体系的，目前压根就不存在。
                </p>
                <p>
                  这个领域最好的学习方式就是<span className="text-white font-semibold">"干中学"</span>(Learning by Doing)。
                </p>
                <div className="mt-6 rounded-xl bg-[#0d0d0d] p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--accent)] mb-4">
                    推荐路径
                  </p>
                  <ol className="space-y-3 text-white/80">
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--accent)] text-[var(--accent-contrast)] flex items-center justify-center text-xs font-bold">1</span>
                      <span>通过吴恩达的短课和自己手撸小项目，建立对 LLM 和 RAG 的扎实体感</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--accent)] text-[var(--accent-contrast)] flex items-center justify-center text-xs font-bold">2</span>
                      <span>选择一个主流框架（如 LangChain），把它当成工具箱，深入理解其设计思想</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--accent)] text-[var(--accent-contrast)] flex items-center justify-center text-xs font-bold">3</span>
                      <span>找一个真实场景，从头到尾做一个 Agent 项目（需求→开发→评估→优化）</span>
                    </li>
                  </ol>
                </div>
                <p className="text-center text-white/60 italic">
                  "这个过程会很痛苦，会踩很多坑，但相信我，这比你看一百个速成视频管用得多。<br />
                  课程是别人给你装骨架，源码和实战才是长肉的地方。"
                </p>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="mt-20 text-center">
            <div className="rounded-2xl bg-[#121212] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
              <h2 className="text-2xl font-bold text-white">准备好开始了吗？</h2>
              <p className="mt-4 text-sm text-white/60 max-w-2xl mx-auto">
                立即获取实战手册和资源，开始你的 AI Agent 学习之旅。
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-4">
                <Link
                  href="/tools"
                  className="rounded-md bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--accent-contrast)] transition hover:brightness-110 hover:shadow-[0_12px_30px_var(--accent-glow)]"
                >
                  探索工具
                </Link>
                <Link
                  href="/prompts"
                  className="rounded-md bg-white/10 px-6 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/16"
                >
                  浏览提示词
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
